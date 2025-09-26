import React from 'react';
import counter from "../../../data/counter.json";
import CountUp from "react-countup";
import VisibilitySensor from "react-visibility-sensor";

function Counter(props) {
    const [focus, setFocus] = React.useState(false);
    return (
        <div className="sigma_counter-wrapper margin-negative bg-primary-1 style-5">
            <div className='justify-content-center'>
            <div className="row" style={{ justifyContent: 'center' }}>
                {/* Data */}
                {counter.map((item, i) => (
                  <div key={i} style={{ 
                    flex: '0 0 auto', 
                    width: '20%', 
                    minWidth: '200px', 
                    // marginBottom: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                        <div className="sigma_counter style-5" style={{ textAlign: 'center' }}>
                            <span>
                                <CountUp start={focus ? 0 : null} end={item.value} duration={5} redraw={true}>
                                    {({ countUpRef }) => (
                                        <VisibilitySensor
                                            onChange={isVisible => {
                                                if (isVisible) {
                                                    setFocus(true);
                                                }
                                            }}
                                        >
                                            <b ref={countUpRef} className="counter" />
                                        </VisibilitySensor>
                                    )}
                                </CountUp>
                                <span className="plus">+</span>
                            </span>
                            <p className="text-white" style={{ textAlign: 'center' }}>{item.title}</p>
                        </div>
                    </div>
                ))}
                {/* Data */}
            </div>
        </div>
        </div>
    );
}

export default Counter;