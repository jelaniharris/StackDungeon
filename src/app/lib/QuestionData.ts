type GetQuestionsParams = {
  domains?: string[];
};

export const getQuestions = async ({ domains }: GetQuestionsParams) => {
  const params = new URLSearchParams(domains?.map((d) => ['domains', d]));
  console.log(params.toString());
  //params.append("domains", domains);
  return fetch('/api/questions?' + params.toString()).then((res) => res.json());
};
