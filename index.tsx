import { useEffect } from "react";
import { useState } from "react";
import s from "./iq180.module.scss";

const iq180 = () => {
  const [rulesWindow, setRulesWindow] = useState<Array<boolean>>([
    false,
    false,
  ]);
  const [custom, setCustom] = useState<boolean>(false);
  const [rules, setRules] = useState<Array<boolean>>([false, false, false]);
  const [numbers, setNumbers] = useState<Array<number>>([]);
  const [target, setTarget] = useState<number>(24);

  useEffect(() => {
    setNumbers(randomList(1, 9, 4));
  }, []);

  useEffect(() => {
    console.log(rules);
  }, [rules]);

  const random = (m: number, n: number) => {
    return Math.floor(Math.random() * (n - m + 1) + m);
  };

  const randomList = (m: number, n: number, l: number) => {
    let list: number[] = [];
    for (let i = 0; i < l; i++) {
      list.push(random(m, n));
    }
    return list;
  };

  const createQuestion = (m: number, n: number, l: number): void => {
    const tempTarget = random(m, n);
    const tempNumbers = randomList(1, 9, l);
    if (!validQuestion(tempNumbers, [], tempTarget))
      return createQuestion(m, n, l);
    else {
      setNumbers(tempNumbers);
      setTarget(tempTarget);
      return;
    }
  };

  const validQuestion = (
    numbersHave: Array<number>,
    numbersLeft: Array<number>,
    target: number
  ) => {
    return true;
  };

  return (
    <div className={s.page}>
      <div>
        <h1
          onClick={() => {
            setRulesWindow([!rulesWindow[0], rulesWindow[1]]);
          }}
        >
          IQ 180 Number Game
        </h1>
        <div style={{ display: rulesWindow[0] ? "block" : "none" }}>
          <p>
            The goal is to use digits below and combine with basic mathematics
            operations ( + , - , * , / ) to get the target number
          </p>
          <p>For example 2 3 4 2, 24 =&gt; 3*(4+2+2)=24</p>
          <p>Advanced rules:</p>
          {["root(√)", "power(^)", "factorial(!)"].map((item, index) => (
            <span key={item}>
              <input
                type="checkbox"
                onChange={() => {
                  setRules((li) => {
                    let l = [...li];
                    l[index] = !l[index];
                    return [...l];
                  });
                }}
              />
              {item}
            </span>
          ))}
        </div>
        <div>
          {custom ? (
            <div>
              <input type="number" min="1" max="9" className="numbox" />
              <input type="number" min="1" max="9" className="numbox" />
              <input type="number" min="1" max="9" className="numbox" />
              <input type="number" min="1" max="9" className="numbox" />
              <input type="number" min="1" max="9" className="numbox" />
              <input type="number" min="1" max="9" className="numbox" />
            </div>
          ) : (
            <div>
              <h2>{numbers.join("\t")}</h2>
            </div>
          )}
        </div>
        <div>
          {custom ? (
            <div>
              <input
                type="number"
                min="0"
                max="999"
                id="target"
                placeholder="Integer (0-999)"
              />
              <button>Search</button>
            </div>
          ) : (
            <div>
              <h2>{target}</h2>
            </div>
          )}
        </div>
        <div>
          <h3
            onClick={() => {
              setRulesWindow([rulesWindow[0], !rulesWindow[1]]);
            }}
          >
            Generate a question
          </h3>
          <div style={{ display: rulesWindow[1] ? "block" : "none" }}>
            <p>Basic: 4 numbers with a target of 24</p>
            <p>Challenging: 5 numbers with a 2 digits target</p>
            <p>Advanced: 6 numbers with a 3 digits target</p>
          </div>
          <button
            onClick={() => {
              createQuestion(24, 24, 4);
            }}
          >
            <div>Basic</div>
          </button>
          <button
            onClick={() => {
              createQuestion(25, 99, 5);
            }}
          >
            <div>Challenging</div>
          </button>
          <button
            onClick={() => {
              createQuestion(100, 999, 6);
            }}
          >
            <div>Advanced</div>
          </button>
          <button
            onClick={() => {
              setCustom(!custom);
            }}
          >
            <div>Custom</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default iq180;
