import * as Cheerio from 'cheerio';
import { readFile } from 'fs/promises';
import mongoose from 'mongoose';
import remarkHtml from 'remark-html';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

import { Question } from '../models/questions';

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

  parseQuestionTitle(title: string) {
    return { title, id: 0 };
  }

  parseQuestionAnswers(
    $: Cheerio.CheerioAPI,
    answers: Cheerio.Cheerio<Cheerio.Element>
  ) {
    //console.log(answers.length);
    //console.log(answers.html());
    const liAnswers = answers.children();
    let correctAnswer = -1;
    const parsedAnswers: string[] = [];

    console.log('Answers: ');
    liAnswers.each((i: number, element) => {
      let liHtml = $(element).html();
      if (liHtml) {
        if (liHtml.includes('[x]')) {
          correctAnswer = i;
        }

        liHtml = liHtml.replace('[x]', '').replace('[ ]', '');
        liHtml = liHtml.trim();

        parsedAnswers.push(liHtml);
      }
      console.log('After:', liHtml, i, correctAnswer);
    });
    console.log('-------------');

    return { answers: parsedAnswers, correctAnswer };
  }

  async parseHTMLQuestion(content: string) {
    const $ = Cheerio.load(content);
    const newQuestion = {
      question: 'XXX',
      description: '',
      answers: [''],
      correctAnswer: 0,
      postAnswerText: '',
    };

    // Parse question title with id
    const { title } = this.parseQuestionTitle($('h4').text());
    newQuestion.question = title;

    // Remove from DOM
    $('h4').remove();

    const answerElements = $('ul');

    const { answers, correctAnswer } = this.parseQuestionAnswers(
      $,
      answerElements
    );

    const postAnswers = answerElements.nextAll();
    answerElements.remove();
    newQuestion.postAnswerText = postAnswers.html() || '';
    postAnswers.remove();
    newQuestion.description = $('body').html() || '';

    newQuestion.answers = answers;
    newQuestion.correctAnswer = correctAnswer;

    //console.log(newQuestion);
    return newQuestion;
  }

  async clearQuestions() {
    return Question.deleteMany();
  }

  async processMarkdownFile(
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
  }
}

(async function () {
  const processor = new ParseLinkedInMarkdown();
  try {
    await processor.connectDB();

    await processor.clearQuestions();

    await processor.processMarkdownFile(
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
    );
  } catch (e) {
    console.error('An error has occurred: ', e);
  } finally {
    await processor.disconnectDB();
  }
})();
