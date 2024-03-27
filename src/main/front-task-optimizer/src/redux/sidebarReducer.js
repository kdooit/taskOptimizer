const TOGGLE_SIDEBAR = 'sidebar/TOGGLE';

// 액션 생성 함수
export const toggleSidebar = () => ({ type: TOGGLE_SIDEBAR });

// 초기 상태 설정. sessionStorage에서 상태를 로드하거나 기본값으로 true 설정
const initialState = {
    isSidebarOpen: sessionStorage.getItem('sidebarState') === null ? true : sessionStorage.getItem('sidebarState') === 'true',
};

// 리듀서
export default function sidebarReducer(state = initialState, action) {
    switch (action.type) {
        case TOGGLE_SIDEBAR:
            const newState = { ...state, isSidebarOpen: !state.isSidebarOpen };
            // 상태 변경 시 sessionStorage에도 저장
            sessionStorage.setItem('sidebarState', newState.isSidebarOpen);
            return newState;
        default:
            return state;
    }
}