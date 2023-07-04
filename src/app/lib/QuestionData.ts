type GetQuestionsParams = {
  domains?: string[];
  numberOfQuestions?: number;
};

export const getQuestions = async ({
  domains,
  numberOfQuestions,
}: GetQuestionsParams) => {
  const params = new URLSearchParams(domains?.map((d) => ['domains', d]));

  // Add number of questions
  if (numberOfQuestions) {
    params.append('numberOfQuestions', `${numberOfQuestions}`);
  }

  console.log(params.toString());
  //params.append("domains", domains);
  return fetch('/api/questions?' + params.toString()).then((res) => res.json());
};
