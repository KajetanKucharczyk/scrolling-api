import {scrolling} from "/scrolling";

scrolling({
        target: "root",
        pages: [
            {id: "page-1", title: "Page 1", theme: {backgroundColor: "black", buttonColor: "#878787", buttonFocusColor: "#c2c2c2"}},
            {id: "page-2", title: "Page 2", theme: {backgroundColor: "#c2c2c2", buttonColor: "#878787", buttonFocusColor: "black"}},
            {id: "page-3", title: "Page 3", theme: {backgroundColor: "#9c0505", buttonColor: "black", buttonFocusColor: "white"}},
            {id: "page-4", title: "Page"},
            {id: "page-5", title: "Page", theme: "light"},
            {id: "page-6", title: "Page", theme: "dark"},
        ],
        options: {
            theme: {buttonColor: "red", buttonFocusColor: "yellow", backgroundColor: "blue"},
            startingPage: 2,
            userCSS: "/css/custom.css",
            blockScroll: false,
        }
    }
);