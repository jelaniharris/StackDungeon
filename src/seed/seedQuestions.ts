import { createHash } from 'crypto';
import mongoose from 'mongoose';

import { QuestionSourceType, QuestionType } from '@/schema/question.schema';

import { Question } from '../models/questions';

interface ParsedQuestion {
  title: string;
  text: string;
  options: number;
  answers: number[];
}

class ParseLinkedInMarkdown {
  async connectDB() {
    if (!process.env.MONGODB_URI) {
      throw new Error('Could not find mongodb uri in env variables');
    }
    await mongoose.connect(process.env.MONGODB_URI);
  }

  async disconnectDB() {
    await mongoose.disconnect();
  }

  async clearQuestions() {
    return Question.deleteMany();
  }

  parseQuestionTitle(title: string) {
    let m;
    let id = 0;
    let parsedTitle = '';
    const regex = /^\s*#### Q(\d+)\.*\s*(.*)/ms;
    if ((m = title.replace('\n', '').match(regex))) {
      if (m[1]) {
        id = parseInt(m[1], 10);
      }

      if (m[2]) {
        parsedTitle = m[2];
      }
    }
    return { title: parsedTitle, id };
  }

  async parseQuestion(question: ParsedQuestion) {
    const newQuestion: QuestionType = {
      question: 'XXX',
      content: '',
      answers: [],
      correctAnswers: [],
      answerInfo: '',
      uniqueHash: '',
      domain: '',
      questionType: '',
      source: {
        url: '',
        questionNumber: 0,
      },
    };

    // Parse question title with id
    const { title, id } = this.parseQuestionTitle(question.title);
    newQuestion.question = title;
    if (newQuestion.source) {
      newQuestion.source.questionNumber = id;
    }

    // Split the lines of the question into newlines
    const lines = question.text.split(/\n/);
    let currentLine = 0;

    // Anything up to the first line that has the %OPTION% in it, is apart
    // of the question data description
    let foundOption = false;
    while (!foundOption && currentLine < lines.length) {
      const line = lines[currentLine];
      if (line && line.match(/%OPTION%/)) {
        foundOption = true;
      } else {
        newQuestion.content += lines[currentLine] + '\n';
        currentLine++;
      }
    }

    const parsedOptions: string[] = [];

    let endOfOptions = false;
    if (foundOption) {
      // Found our first option
      let optionCodeWrapped = false;
      while (!endOfOptions && currentLine < lines.length) {
        const line = lines[currentLine];
        //console.log(line);
        if (line && line.match(/%OPTION%/)) {
          parsedOptions.push('');
          optionCodeWrapped = false;
        }

        // If are encountering an option
        if (parsedOptions.length) {
          // Get the latest index
          const optionIndex = parsedOptions.length - 1;

          // Check to see if there's a start to a code block
          if (line.match(/^```/)) {
            optionCodeWrapped = !optionCodeWrapped;
          }

          // Check if we encounted the end of an option
          // and we're NOT wrapped around in code
          if (
            !optionCodeWrapped &&
            (line.match(/^\*\*/) ||
              line.match(/^1\.\s+/) ||
              line.match(/^\[\w+\]/))
          ) {
            endOfOptions = true;
          } else {
            // Append line to option
            parsedOptions[optionIndex] += lines[currentLine] + '\n';
            currentLine++;
          }
        } else {
          currentLine++;
        }
      }
    }

    // Record anything after the answers as a postAnswerText
    let postAnswers = '';
    if (endOfOptions) {
      while (currentLine < lines.length) {
        postAnswers += lines[currentLine];
        currentLine++;
      }
    }

    postAnswers = postAnswers.trim();

    parsedOptions.forEach((option) => {
      console.log(option);
      const cleanOption = option.replace(/^-\s*%OPTION%/, '').trim();
      newQuestion.answers.push(cleanOption);
    });

    newQuestion.answerInfo = postAnswers;
    newQuestion.correctAnswers = question.answers;

    /*const processor = await unified().use(remarkParse).use(remarkHtml);

    const fl = await processor.parse(question.text);

    console.log(fl);*/

    return newQuestion;
  }

  async processRemoteMarkdownFile(
    fileloc: string,
    domain: string,
    questionType: string,
    grouping: string,
    source: QuestionSourceType
  ) {
    const markdown = await fetch(fileloc, {
      headers: new Headers({ accept: 'application/vnd.github.v3.raw' }),
    }).then((response) => response.text());

    //console.log(markdown);

    // Extract the text from the remote markdown
    /*const markdown = fs.readFileSync(
      path.join(process.cwd(), 'src/data/reactjs-quiz.md'),
      {
        encoding: 'utf-8',
      }
    );*/

    let title = 'Unknown Question';

    const markdownLines: string[] = markdown.split(/\n/);
    const questions: ParsedQuestion[] = [];
    markdownLines.forEach((line) => {
      /// Find the title - Titles start with ##
      if (line.match(/^\s*##\s/)) {
        title = line;
        //console.log('Found title: ', title);
      }

      // The beginning of questions
      // The start of a question begins with ####
      else if (line.match(/^\s*####\s/)) {
        questions.push({
          text: '',
          title: line + '\n',
          options: -1,
          answers: [],
        });
      }

      // Body of question
      else {
        if (questions.length) {
          const question = questions[questions.length - 1];
          let m;

          // Parse Answer Options - regex against "- [ ]" or "- [x]"
          if ((m = line.match(/^\s*-\s*\\?\[\s*(x)?\s*\]/i))) {
            question.options++;

            if (m[1]) {
              question.answers.push(question.options);
            }

            line = line.replace(m[0], '- %OPTION%');
          }

          question.text += line + '\n';
        }
      }

      return questions;
    }, []);

    //const testQuestions = [questions[108]];

    const cleanedQuestions = await Promise.all(
      questions.map(async (questionText) => {
        return this.parseQuestion(questionText);
      })
    );

    //console.log(cleanedQuestions);

    for (const question of cleanedQuestions) {
      // Assign grouping
      question.grouping = grouping;
      question.domain = domain;
      question.questionType = questionType;
      question.uniqueHash = createHash('sha256')
        .update(question.question)
        .digest('hex');
      if (question.source) {
        //questionNumber is already in the cleanedQuestions
        question.source.url = source.url;
      }

      if (question.correctAnswers.length === 0) {
        console.log('Could not find a answer for: ', question);
        continue;
      }

      /*console.log(
        `Creating question for ${question.domain}: #${question.source?.questionNumber}`
      );*/

      //console.log(question);

      await Question.create(question);
    }

    //console.log(cleanedQuestions);

    return {
      questions: cleanedQuestions,
      title,
    };
  }

  /*async processMarkdownFile(
    fileloc: string,
    domain: string,
    questionType: string,
    source: string
  ) {
    const file = await readFile(fileloc, 'utf8');
    const parsedQuestions = file.split('####');

    const cleanedQuestions = await Promise.all(
      parsedQuestions.map(async (questionText) => {
        const fl = await unified()
          .use(remarkParse)
          .use(remarkHtml)
          .process(`#### ${questionText}`);
        return this.parseHTMLQuestion(String(fl));
      })
    );

    await Promise.all(
      cleanedQuestions.map(async (question) => {
        if (question.correctAnswer < 0) {
          console.log('Could not find a answer for: ', question);
          return;
        }

        return Question.create({
          uniqueHash: '',
          question: question.question,
          content: question.description,
          domain: domain,
          questionType: questionType,
          answers: question.answers,
          correctAnswer: question.correctAnswer,
          source: source,
        });
      })
    );
  }*/
}

(async function () {
  const processor = new ParseLinkedInMarkdown();
  try {
    await processor.connectDB();

    await processor.clearQuestions();

    // PHP #70 for a multi answer question

    //
    const linkedInContents = [
      {
        path: 'reactjs/reactjs-quiz.md',
        domain: 'reactjs',
        source: {
          url: 'https://github.com/Ebazhanov/linkedin-skill-assessments-quizzes/blob/main/reactjs/reactjs-quiz.md',
        },
      },
      {
        path: 'javascript/javascript-quiz.md',
        domain: 'javascript',
        source: {
          url: 'https://github.com/Ebazhanov/linkedin-skill-assessments-quizzes/blob/main/javascript/javascript-quiz.md',
        },
      },
      {
        path: 'php/php-quiz.md',
        domain: 'php',
        source: {
          url: 'https://github.com/Ebazhanov/linkedin-skill-assessments-quizzes/blob/main/javascript/php/php-quiz.md',
        },
      },
      {
        path: 'node.js/node.js-quiz.md',
        domain: 'nodejs',
        source: {
          url: 'https://github.com/Ebazhanov/linkedin-skill-assessments-quizzes/blob/main/node.js/node.js-quiz.md',
        },
      },
      {
        path: 'ruby-on-rails/ruby-on-rails-quiz.md',
        domain: 'ruby-on-rails',
        source: {
          url: 'https://github.com/Ebazhanov/linkedin-skill-assessments-quizzes/blob/main/ruby-on-rails/ruby-on-rails-quiz.md',
        },
      },
      {
        path: 'mysql/mysql-quiz.md',
        domain: 'mysql',
        source: {
          url: 'https://github.com/Ebazhanov/linkedin-skill-assessments-quizzes/blob/main/mysql/mysql-quiz.md',
        },
      },
    ];

    for (const content of linkedInContents) {
      await processor.processRemoteMarkdownFile(
        `https://api.github.com/repos/Ebazhanov/linkedin-skill-assessments-quizzes/contents/${content.path}`,
        content.domain,
        'multiple-choice',
        'linkedin-assessments',
        {
          url: `https://github.com/Ebazhanov/linkedin-skill-assessments-quizzes/blob/main/${content.path}`,
        }
      );
    }

    /*await processor.processRemoteMarkdownFile(
      'https://api.github.com/repos/Ebazhanov/linkedin-skill-assessments-quizzes/contents/reactjs/reactjs-quiz.md',
      //'https://github.com/Ebazhanov/linkedin-skill-assessments-quizzes/blob/main/reactjs/reactjs-quiz.md',
      'reactjs',
      'multiple-choice',
      'linkedin-assessments',
      'https://github.com/Ebazhanov/linkedin-skill-assessments-quizzes/blob/main/reactjs/reactjs-quiz.md'
    );*/

    /*await processor.processMarkdownFile(
      './src/data/reactjs-quiz.md',
      'reactjs',
      'multiple-choice',
      'https://github.com/Ebazhanov/linkedin-skill-assessments-quizzes/blob/main/reactjs/reactjs-quiz.md'
    );

    await processor.processMarkdownFile(
      './src/data/ruby-on-rails-quiz.md',
      'ruby-on-rails',
      'multiple-choice',
      'https://github.com/Ebazhanov/linkedin-skill-assessments-quizzes/blob/main/ruby-on-rails/ruby-on-rails-quiz.md'
    );

    await processor.processMarkdownFile(
      './src/data/javascript-quiz.md',
      'javascript',
      'multiple-choice',
      'https://github.com/Ebazhanov/linkedin-skill-assessments-quizzes/blob/main/javascript/javascript-quiz.md'
    );

    await processor.processMarkdownFile(
      './src/data/node.js-quiz.md',
      'nodejs',
      'multiple-choice',
      'https://github.com/Ebazhanov/linkedin-skill-assessments-quizzes/blob/main/node.js/node.js-quiz.md'
    );*/
  } catch (e) {
    console.error('An error has occurred: ', e);
  } finally {
    await processor.disconnectDB();
  }
})();
