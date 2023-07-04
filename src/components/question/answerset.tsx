import { ImCheckmark, ImCross } from 'react-icons/im';

type AnswerSetProps = {
  currentQuestion: number;
  answerSet: (boolean | null)[];
};

const AnswerSet = ({ currentQuestion, answerSet }: AnswerSetProps) => {
  let boxes = [];

  if (!answerSet || answerSet.length == 0) {
    return <>No Questions Yet</>;
  }

  boxes = answerSet.map((element, index) => {
    let boxStyle = '';
    let textSet = <>{`${index + 1}`}</>;
    if (element == null) {
      boxStyle = 'bg-accent-700 p-2 text-white ';
    } else if (element == true) {
      boxStyle = 'bg-green-700 px-2 py-1 text-white ';
      textSet = <ImCheckmark />;
    } else {
      boxStyle = 'bg-red-700 px-2 py-1  text-white';
      textSet = <ImCross />;
    }

    if (currentQuestion == index) {
      boxStyle = 'bg-yellow-500 text-gray-800 p-2 ';
    }

    return (
      <div
        key={`answer-map-${index}`}
        className={`mx-3 h-10 w-10 cursor-default rounded-md text-center font-bold ${boxStyle}`}
      >
        {textSet}
      </div>
    );
  });

  return (
    <div className='my-7 flex flex-row items-center justify-center'>
      {boxes}
    </div>
  );
};

export default AnswerSet;
