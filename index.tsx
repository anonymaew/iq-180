import { useEffect } from "react";
import { useState } from "react";
import s from "./iq180.module.scss";

const IQ180 = () => {
  const [rulesWindow, setRulesWindow] = useState<Array<boolean>>([
    false,
    false,
    false,
  ]);
  const [custom, setCustom] = useState<boolean>(false);
  const [rules, setRules] = useState<Array<boolean>>([false, false, false]);
  const [numbers, setNumbers] = useState<Array<number>>([]);
  const [target, setTarget] = useState<number>(24);
  const [answer, setAnswer] = useState<String>(" ");
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const fac: Array<number> = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880];

  useEffect(() => {
    createQuestion(24, 24, 4);
    document
      .getElementById("icon")!
      .setAttribute(
        "href",
        "https://raw.githubusercontent.com/anonymaew/iq-180/master/icon.png"
      );
  }, []);

  useEffect(() => {
    if (!custom) return;
    validQuestion(numbers, target);
  }, [numbers, target]);

  useEffect(() => {
    setShowAnswer(false);
  }, [custom, answer, rules]);

  class op {
    constructor(public val: number, public s: string) {
      this.val = val;
      this.s = s;
    }
  }

  const random = (m: number, n: number) => {
    return Math.floor(Math.random() * (n - m + 1) + m);
  };

  const randomList = (m: number, n: number, l: number) => {
    let list: number[] = [];
    for (let i = 0; i < 6; i++) {
      list.push(i < l ? random(m, n) : 0);
    }
    return list;
  };

  const createQuestion = (m: number, n: number, l: number): void => {
    setCustom(false);
    const tempTarget = random(m, n);
    const tempNumbers = randomList(1, 9, l);
    //create until there is an answer
    if (!validQuestion(tempNumbers, tempTarget)) return createQuestion(m, n, l);
    else {
      setNumbers(tempNumbers);
      setTarget(tempTarget);
      return;
    }
  };

  //check if there is an answer
  const validQuestion = (tempNumbers: Array<number>, tempTarget: number) => {
    const tempList = tempNumbers
      .filter((i) => i != 0)
      .map((i) => new op(i, i.toString()));
    const result = find(tempList, tempTarget);
    if (result) {
      setAnswer(result[0].s + " = " + result[0].val);
      return true;
    } else {
      setAnswer("There is no solution");
      return null;
    }
  };

  const find = (lis: Array<op>, targetNumber: number): Array<op> | null => {
    //base case
    if (lis.length == 1 && lis[0].val == targetNumber) return lis;
    let li: Array<op> = [];
    let result: Array<op> | null = null;
    if (lis.length > 1) {
      //every possible combination
      for (const [i, u] of Object.entries(lis)) {
        for (const [j, v] of Object.entries(lis)) {
          //eliminate the same element
          if (i == j) continue;
          li = lis.filter((w, k) => k != parseInt(i) && k != parseInt(j));
          //plus
          result = find(
            [...li, new op(u.val + v.val, "(" + u.s + "+" + v.s + ")")],
            targetNumber
          );
          if (result) return result;
          //minus
          if (u.val > v.val) {
            result = find(
              [...li, new op(u.val - v.val, "(" + u.s + "-" + v.s + ")")],
              targetNumber
            );
            if (result) return result;
          }
          //multiply
          result = find(
            [...li, new op(u.val * v.val, "(" + u.s + "*" + v.s + ")")],
            targetNumber
          );
          if (result) return result;
          //divide
          if (v.val != 0 && u.val % v.val == 0) {
            result = find(
              [...li, new op(u.val / v.val, "(" + u.s + "/" + v.s + ")")],
              targetNumber
            );
            if (result) return result;
          }
          //root
          if (rules[0]) {
            if (v.val != 0) {
              if (Math.fround(Math.pow(u.val, 1 / v.val)) % 1 == 0) {
                result = find(
                  [
                    ...li,
                    new op(
                      Math.fround(Math.pow(u.val, 1 / v.val)),
                      "(" + v.s + "√" + u.s + ")"
                    ),
                  ],
                  targetNumber
                );
                if (result) return result;
              }
            }
          }
          //power
          if (rules[1]) {
            if ((u.val <= 48 && v.val <= 12) || u.val == 1) {
              result = find(
                [
                  ...li,
                  new op(Math.pow(u.val, v.val), "(" + u.s + "^" + v.s + ")"),
                ],
                targetNumber
              );
              if (result) return result;
            }
          }
        }
      }
    } else if (lis.length == 1) {
      const u = lis[0];
      //sqrt
      if (rules[0]) {
        if (Math.sqrt(u.val) % 1 == 0 && u.val > 1) {
          result = find(
            [new op(Math.sqrt(u.val), "(√" + u.s + ")")],
            targetNumber
          );
          if (result) return result;
        }
      }
      //factorial
      if (rules[1]) {
        if (2 < u.val && u.val < 8) {
          result = find([new op(fac[u.val], "(" + u.s + "!)")], targetNumber);
          if (result) return result;
        }
      }
    }
    return null;
  };

  return (
    <div className={s.page}>
      <div>
        <div>
          <h1>IQ 180 Number Game</h1>
          <p
            style={{ color: "#484f58" }}
            onClick={() => {
              setRulesWindow([!rulesWindow[0], rulesWindow[1]]);
            }}
          >
            Click to {rulesWindow[0] ? "hide" : "expand"}
          </p>
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
        </div>
        <div>
          {custom ? (
            <div>
              {numbers.map((item, index) => (
                <input
                  maxLength={1}
                  key={index}
                  className="numbox"
                  defaultValue={item == 0 ? "" : item}
                  onChange={(e) => {
                    let l = [...numbers];
                    l[index] = parseInt(e.target.value) | 0;
                    setNumbers(l);
                  }}
                  onKeyPress={(e) => {
                    if (e.key.match(/[^1-9]/g)) e.preventDefault();
                  }}
                />
              ))}
            </div>
          ) : (
            <div>
              <h2>{numbers.filter((i) => i != 0).join("\t")}</h2>
            </div>
          )}
        </div>
        <div>
          {custom ? (
            <div>
              <input
                maxLength={3}
                id="target"
                defaultValue={target}
                onChange={(e) => {
                  setTarget(parseInt(e.target.value));
                }}
                onKeyPress={(e) => {
                  if (e.key.match(/[^0-9]/g)) e.preventDefault();
                }}
              />
            </div>
          ) : (
            <div>
              <h2>{target}</h2>
            </div>
          )}
          <p
            style={{ color: showAnswer ? "" : "#484f58" }}
            onClick={() => {
              setShowAnswer(!showAnswer);
            }}
          >
            {showAnswer ? answer : "Click to show a solution"}
          </p>
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

export default IQ180;
