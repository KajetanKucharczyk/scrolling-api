# SCROLLING PAGE

## MAIN FUNCTION
  
import scrolling from "./scrolling.js"; - imports js functionality (if stored locally)  
or  
import scrolling from "kkucharczyk/scrolling.min.js"; - imports js functionality (if stored on my server)  
  
  
scrolling(TARGET : OBLIGATORY (STRING), PAGES : OBLIGATORY (ARRAY), OPTIONS : OPTIONAL (OBJECT));

TARGET - where to put ready dom elements like pages, buttons. As a TARGET must be passed an ID of DOM element. An ID must be unique.
PAGES - HTML div elements () to render on pages. Page must to have UNIQUE id. PAGES is array, so if there is one page, should be passed also as array. More info below.
OPTIONS - non obligatory options. Passed as object. More info below.

All css styles are included in the following script. The original address of CSS file is: . The file can be downloaded from this link. If you want to include downloaded CSS file or your own, use userCSS in options. More info below.

## MORE INFO
```
PAGES: OBLIGATORY (MIN. 1) [ ARRAY (MIN. LENGTH 1)]
  {
     id: OBLIGATORY (STRING UNIQUE),
     title: OBLIGATORY (STRING),
     theme: OPTIONAL (OPTION: "light" OR "dark" OR ) {
       backgroundColor: OPTIONAL (STRING),
       buttonColor: OPTIONAL (STRING),
       buttonFocusColor: OPTIONAL (STRING)
     }
  },
]

PAGES array store objects with following fields (minimum 1 object with id and title):
id                 - unique ID of passed DOM div element. Elements inside DOM div element will be rendered inside the page. id property must be a STRING. id property is OBLIGATORY.
title              - name of current page. title property is OBLIGATORY.
theme              - individual theme of current page. Can be set as "light" or "dark" or as an object (more info below). theme property is OPTIONAL. theme property overwrites default and global theme.
theme object could store following fields:
  backgroundColor  - background color of current page. background property must be a STRING
  buttonColor      - color of buttons on current page. buttonColor property must be a STRING
  buttonFocusColor - color of focused buttons on current page. buttonFocusColor property must be a STRING


OPTIONS : OPTIONAL { OBJECT
    theme: OBJECT {
     buttonColor: OPTIONAL (STRING),
     buttonFocusColor: OPTIONAL (STRING)
    },
    startingPage: OPTIONAL (INT) (DEFAULT 1),
    userCSS: (OPTIONAL) (STRING) (DEFAULT NULL)
    animationSpeed: (OPTIONAL) (STRING or INT) (DEFAULT 500)
}

theme                - global theme of all pages. Can be set as an object (more info below). theme property is OPTIONAL. theme property is overwritten by pages theme (if set).
theme object could store following fields:
   backgroundColor   - background color of all pages. background property must be a STRING
   buttonColor       - color of buttons on all pages. buttonColor property must be a STRING
   buttonFocusColor  - color of focused buttons on all pages. buttonFocusColor property must be a STRING
startingPage         - no of page, where the program starts. startingPage must be an INT. startingPage is set to 1 as default.
userCSS              - including custom CSS. The userCSS value must be STRING containing path to local CSS file or its URL address.
animationSpeed       - defining the speed of animations. Four pre-defined string are provided: "none", "slow", "default" and "fast" (0ms, 150ms, 500ms, 1000ms).
                       The number of ms can also be set (as an INT or STRING). If the speed is set to be 0 or "0ms" or FALSE, all animations will be disabled.
blockScroll          - Blocking default scroll. As default set to FALSE. It produces one static webpage without the possibility of moving from page to page.
```
## EXAMPLE OF USAGE

HTML: 
```
<div id="root"></div>  
<div id = "page-1">SOME TEXT</div>  
<div id = "page-2">SOME ANOTHER TEXT</div>  
<div id = "page-3">bla bla bla bla bla bla bla </div>  
<div id = "page-4">bla bla bla bla bla bla bla </div>  
<div id = "page-5">bla bla bla bla bla bla bla </div>  
<div id = "page-6">bla bla bla bla bla bla bla </div>  
```
  
JS:  
```
import scrolling from "./scrolling.js";  
scrolling("root", [  
    {id: "page-1", title: "Page 1", theme: {backgroundColor: "black", buttonColor: "#878787", buttonFocusColor: "#c2c2c2"}},  
    {id: "page-2", title: "Page 2", theme: {backgroundColor: "#c2c2c2", buttonColor: "#878787", buttonFocusColor: "black"}},  
    {id: "page-3", title: "Page 3", theme: {backgroundColor: "#9c0505", buttonColor: "black", buttonFocusColor: "white"}},  
    {id: "page-4", title: "Page"},  
    {id: "page-5", title: "Page", theme: "light"},  
    {id: "page-6", title: "Page", theme: "dark"},  
  ],  
  {  
    theme: {buttonColor: "red", buttonFocusColor: "yellow", backgroundColor: "blue"},  
    startingPage: 2,  
    userCSS: "/css/custom.css",  
    animationSpeed: "none",  
    blockScroll: false,  
  }  
);  
```
