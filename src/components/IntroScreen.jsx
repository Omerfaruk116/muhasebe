import { useEffect } from "react";

function IntroScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3200);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="el-turco-intro">
      <style>
        {`
          .el-turco-intro {
            min-height: 100vh;
            background:
              radial-gradient(circle at center, rgba(185, 28, 28, 0.28), transparent 34%),
              radial-gradient(circle at bottom, rgba(15, 23, 42, 0.95), #020617 60%),
              #020617;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            position: relative;
          }

          .el-turco-intro::before {
            content: "";
            position: absolute;
            width: 300px;
            height: 300px;
            border-radius: 999px;
            background: rgba(220, 38, 38, 0.18);
            filter: blur(60px);
            animation: redGlow 2.8s ease-in-out infinite;
          }

          .intro-content {
            position: relative;
            z-index: 2;
            text-align: center;
            width: 100%;
            max-width: 430px;
            padding: 24px;
            animation: introAppear 0.9s ease both;
          }

          .production {
            color: #ef4444;
            font-size: 13px;
            letter-spacing: 6px;
            font-weight: 900;
            text-shadow: 0 0 18px rgba(239, 68, 68, 0.75);
            margin-bottom: 22px;
          }

          .el-title {
            font-size: 54px;
            line-height: 1;
            margin: 0;
            letter-spacing: 2px;
            font-weight: 900;
            text-shadow:
              0 0 18px rgba(239, 68, 68, 0.9),
              0 0 45px rgba(127, 29, 29, 0.85);
            animation: titlePulse 1.8s ease-in-out infinite;
          }

          .el-subtitle {
            margin: 14px 0 0;
            color: #cbd5e1;
            font-size: 15px;
            letter-spacing: 1px;
          }

          .intro-line {
            width: 250px;
            height: 8px;
            border-radius: 999px;
            background: #111827;
            margin: 34px auto 0;
            overflow: hidden;
            border: 1px solid #1e293b;
          }

          .intro-line div {
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, #7f1d1d, #ef4444, #f87171);
            border-radius: 999px;
            animation: loadLine 2.7s ease forwards;
          }

          .intro-small {
            margin-top: 14px;
            color: #64748b;
            font-size: 12px;
            letter-spacing: 2px;
          }

          .slash {
            position: absolute;
            width: 180%;
            height: 2px;
            background: linear-gradient(90deg, transparent, rgba(239,68,68,0.65), transparent);
            transform: rotate(-18deg);
            animation: slashMove 2.8s ease-in-out infinite;
          }

          @keyframes introAppear {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.97);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes titlePulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.035);
            }
          }

          @keyframes loadLine {
            from {
              width: 0%;
            }
            to {
              width: 100%;
            }
          }

          @keyframes redGlow {
            0%, 100% {
              transform: scale(1);
              opacity: 0.75;
            }
            50% {
              transform: scale(1.18);
              opacity: 1;
            }
          }

          @keyframes slashMove {
            0% {
              top: 20%;
              opacity: 0;
            }
            35% {
              opacity: 1;
            }
            100% {
              top: 80%;
              opacity: 0;
            }
          }
        `}
      </style>

      <div className="slash"></div>

      <div className="intro-content">
        <div className="production">L.M. PRODUCTION</div>

        <h1 className="el-title">EL TURCO</h1>

        <p className="el-subtitle">Kolay Muhasebe</p>

        <div className="intro-line">
          <div></div>
        </div>

        <p className="intro-small">SİSTEM HAZIRLANIYOR</p>
      </div>
    </div>
  );
}

export default IntroScreen;