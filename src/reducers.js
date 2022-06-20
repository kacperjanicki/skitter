export const postReducer = (state, action) => {
    switch (action.type) {
        case "LATEST-NEWEST":
            console.log(action.payload);
            return { ...state, latest: action.payload };
    }
};
