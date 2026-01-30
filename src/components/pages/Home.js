import React, { Component, Fragment } from 'react';
import { Helmet } from "react-helmet-async";
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import Content from '../sections/home/Content';

const pagelocation = "Homepage";

// const NewsTicker = () => (
//   <div
//     style={{
//       position: "sticky",
//       top: 0,
//       zIndex: 1200,
//       width: "100%",
//       background: "linear-gradient(90deg, #007a7e 0%, #1e293b 100%)",
//       color: "#fff",
//       fontWeight: 700,
//       fontSize: "18px",
//       letterSpacing: "0.5px",
//       overflow: "hidden",
//       height: "44px",
//       display: "flex",
//       alignItems: "center",
//       boxShadow: "0 2px 12px rgba(0,122,126,0.10)",
//       borderBottom: "2px solid #00ffe7cc",
//     }}
//   >
//     <div
//       style={{
//         whiteSpace: "nowrap",
//         display: "inline-block",
//         animation: "ticker-scroll 18s linear infinite",
//         paddingLeft: "100%",
//         fontFamily: 'inherit',
//       }}
//     >
//       Become a member at 49rs &nbsp;|&nbsp; ಕೇವಲ 49 ರೂಪಾಯಿಗೆ ವೈದ್ಯಬಂಧು ಆರೋಗ್ಯ ಕಾರ್ಡ್‌ ಪಡೆಯಿರಿ.
//     </div>
//     <style>{`
//       @keyframes ticker-scroll {
//         0% { transform: translateX(0); }
//         100% { transform: translateX(-100%); }
//       }
//     `}</style>
//   </div>
// );

class Home extends Component {
    render() {
        return (
            <Fragment>
                <Helmet>
                    <title>Vaidya Bandhu</title>
                    <meta
                        name="description"
                        content="#"
                    />
                </Helmet>
                {/* <NewsTicker /> */}
                <Header />
                <Content />
                <Footer />
            </Fragment>
        );
    }
}

export default Home;
