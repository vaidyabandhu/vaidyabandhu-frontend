import React from "react";
import counter from "../../../data/counter.json";
import CountUp from "react-countup";
import VisibilitySensor from "react-visibility-sensor";

function Counter() {
  const [focus, setFocus] = React.useState(false);

  return (
    <div className="vb-about-stats-shell">
      <div className="vb-about-stats-grid">
        {counter.map((item) => (
          <div className="vb-about-stat-card" key={item.id}>
            <div className="vb-about-stat-icon">
              <i className={item.icon} />
            </div>
            <div className="vb-about-stat-value">
              <CountUp start={focus ? 0 : null} end={item.value} duration={4} redraw>
                {({ countUpRef }) => (
                  <VisibilitySensor
                    onChange={(isVisible) => {
                      if (isVisible) {
                        setFocus(true);
                      }
                    }}
                    partialVisibility
                  >
                    <span>
                      <b ref={countUpRef} className="counter" />
                      <span className="plus">+</span>
                    </span>
                  </VisibilitySensor>
                )}
              </CountUp>
            </div>
            <p>{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Counter;
