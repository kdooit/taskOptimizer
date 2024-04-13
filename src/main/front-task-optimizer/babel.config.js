import "core-js/stable";
import "regenerator-runtime/runtime";

module.exports = {
    presets: [
        // @babel/preset-env 설정: 최신 JavaScript를 변환
        ["@babel/preset-env", {
            targets: "> 0.25%, not dead",  // 브라우저 호환성 목표 설정
            useBuiltIns: "usage",          // 필요한 폴리필 자동 포함
            corejs: 3,                     // core-js 버전 3 사용
            modules: false,                // 모듈 시스템 변경을 하지 않음, 웹팩2+의 트리 쉐이킹을 위해
        }],
        // @babel/preset-react 설정: JSX 변환
        ["@babel/preset-react", {
            runtime: "automatic",          // React import 문을 자동으로 추가하지 않음
            development: process.env.NODE_ENV === "development" // 개발 모드 최적화
        }]
    ],
    plugins: [
        // 클래스 프로퍼티를 사용하기 위한 플러그인
        ["@babel/plugin-proposal-class-properties", {
            "loose": true  // 더 느슨한 스펙으로 클래스 프로퍼티 변환
        }],
        // 옵셔널 체이닝과 같은 최신 문법 지원
        "@babel/plugin-proposal-optional-chaining",
        // 런타임 중에 Babel의 헬퍼 함수를 재사용, 코드 중복 감소
        ["@babel/plugin-transform-runtime", {
            "corejs": false, // core-js를 사용하지 않음, preset-env에서 관리
            "helpers": true, // Babel 헬퍼를 외부 참조로 이동
            "regenerator": true, // 비동기 함수를 위한 regenerator-runtime 사용
            "version": "7.15.4" // 사용중인 @babel/runtime 버전
        }]
    ],
    // 개발 환경에서만 적용할 설정
    env: {
        development: {
            plugins: [
                // 리액트 컴포넌트의 디버깅을 용이하게 하는 플러그인
                "react-refresh/babel"
            ]
        }
    }
};
