class scrollingClass {

  /**
   *  Start programu
   *
   * @param parameters - parametry pobrane z wywołania
   */
  constructor({target, pages, options, options: {init}}) {
    if(this.checkVariable(options) && !this.checkVariable(init)) this.proceedInitObject({target, pages, options});
  }

  /**
   * Przygotowanie zmiennych i odpalenie funckji kreujących
   *
   * @param target - element gdzie wklejamy strony
   * @param pages - dane stron
   * @param options - dodatkowe opcje
   */
  proceedInitObject({target, pages, options, options: {userCSS}}) {
    this.loadVariables(target, pages, options);
    this.loadPages(pages, options);
    this.CSSUploader((!this.checkVariable(userCSS)) ? "/css/scrolling.min.css" : userCSS);
  }

  /**
   * Przgotowanie zmiennych
   *
   * @param target - element gdzie wklejamy strony
   * @param pages - dane stron
   * @param options - dodatkowe opcje
   */
  loadVariables(target, pages, options) {
    this.TARGET = this.getDomElements("id", target);
    this.INIT_PAGES = pages;
    this.PAGES = [];
    this.CONTAINER = this.containerTemplate();
    this.BUTTONS = this.buttonContainerTemplate();
    this.ANIMATION_DURATION = this.animationSpeed(options);
    this.PAGE_TITLE = this.pageTitle(options);
    this.COUNTER = 0;
    this.TIMEOUT = [];
    this.BLOCK_SCROLL = this.blockScroll(options);
    this.THEME = {
      PAGES: [],
      DEFAULT_THEME: {},
    };
    this.THEME_DARK = {
      backgroundColor: "black",
      buttonColor: "#878787",
      buttonFocusColor: "white",
    };
    this.THEME_LIGHT = {
      backgroundColor: "white",
      buttonColor: "#878787",
      buttonFocusColor: "black",
    };
    this.DEFAULT_THEME = {};
    this.RUN = true;
    this.BUTTONS_VISIBLITY = this.setButtonsVisibility(options);
  }

  /**
   * Odpalenie scrolla po ruchu kółkiem myszy
   */
  detectScroll() {
    this.CONTAINER.addEventListener("wheel", ({deltaY}) => {
      if (!this.BLOCK_SCROLL) this.scrollPage(this.CONTAINER, this.COUNTER, deltaY > 0 ? this.COUNTER + 1 : this.COUNTER - 1);

    });
  }

  /**
   * Kreacja stron
   *
   * @param pages - strony do wykreowania
   * @param theme - opcjonalny domyślny theme
   */
  loadPages(pages, {theme, startingPage}) {
    pages.forEach((page, index) => {
      if (!this.checkVariable(page.id)) return false;
      this.THEME.PAGES.push(this.themeLoader(this.checkVariable(page.theme) ? page.theme : null, this.checkVariable(theme) ? theme : null));
      this.createPage(this.pageTemplate(page, index));
    })
    this.PAGES.forEach(item => this.CONTAINER.append(item));
    this.TARGET.append(this.CONTAINER);

    setTimeout(() => this.startingPage(startingPage), 50)
  }

  /**
   * Tworzenie strony
   *
   * @param pageTemplateObject = {
   *   domObject - fizyczny element DOM zawierający stronę
   *   pageTemplate - template strony
   *   page - aktualna strona
   *   index - index aktualnej strony
   * } - wynik działania funckji this.pageTemplate
   */
  createPage({domObject, pageTemplate}) {
    this.PAGES.push(pageTemplate);
    domObject.parentNode.removeChild(domObject);
  }

  /**
   * Tworzenie szkieletu buttonów
   *
   * @param destination
   */
  pageButtons(destination) {
    this.PAGES.forEach((element, index) => this.BUTTONS.append(this.buttonTemplate(index)));
    destination.append(this.BUTTONS);
    if(this.BUTTONS_VISIBLITY) this.buttons(this.COUNTER);
    this.hidePageDescription(3000);
  }

  /**
   * Opracowanie buttonów
   *
   * @param nexPage
   */
  buttons(nexPage) {
    this.activateButton(nexPage);
    this.mouseButtons();
    this.colorButtons(nexPage);
    this.openPageDescription();
    this.BUTTONS.style.marginTop = (this.TARGET.style.height + this.PAGES.length * 45) / 2 + "px";
  }

  /**
   * Ustal aktywny button i napis odnoszący się do aktulanej strony
   *
   * @param activePage
   */
  activateButton(activePage = 0) {
    this.removeClass("active", "scrolling-js-link-button")
    this.addClass("active", "scrolling-js-link-button", activePage);
    this.removeClass("active", "scrolling-js-float-box")
    this.addClass("active", "scrolling-js-float-box", activePage);
  }

  /**
   * Wyłączaj wyświetlanie napisu po wyjechaniu myszą
   */
  mouseButtons() {
    let elements = this.getDomElements("class", "scrolling-js-link-container");
    elements.forEach((item) => {
      item.addEventListener("mouseover", () => {
        this.removeClass("hidden", "scrolling-js-float-box");
        this.TIMEOUT.forEach((value) => clearTimeout(value));
      })
      item.addEventListener("mouseout", () => this.hidePageDescription());
    })
  }

  /**
   * Ukrywanie napisów
   *
   * @param time
   */
  hidePageDescription(time = 1500) {
    if(!this.BLOCK_SCROLL)
      this.TIMEOUT.push(setTimeout(() => this.addClass("hidden", "scrolling-js-float-box"), time));
  }

  /**
   * Manualne otwieranie napisów
   *
   * @param time
   */
  openPageDescription(time = 3 * this.ANIMATION_DURATION) {
    this.removeClass("hidden", "scrolling-js-float-box");
  }

  /**
   * Kolorowanie buttonów
   *
   * @param page
   */
  colorButtons(page = 0) {
    this.colorItem(this, page, this.getDomElements("class", "scrolling-js-float-box"), "color", this.getDomElements("class", "scrolling-js-link-button"))
    this.colorItem(this, page, this.getDomElements("class", "scrolling-js-link-button"), "backgroundColor", this.getDomElements("class", "scrolling-js-float-box"))
  }
  colorItem(context, page, items, modifier, items2) {
    items.forEach((floatBoxItem, index) => {
      floatBoxItem.style[modifier == "color" ? "color" : "backgroundColor"] = context.THEME.PAGES[page].buttonColor === null ? context.DEFAULT_THEME.buttonColor : context.THEME.PAGES[page].buttonColor;
      floatBoxItem.addEventListener("mouseover", function() {
        this.style[modifier == "color" ? "color" : "backgroundColor"] = context.THEME.PAGES[page].buttonFocusColor === null ? context.DEFAULT_THEME.buttonFocusColor : context.THEME.PAGES[page].buttonFocusColor;
        items2[index].style[modifier == "backgroundColor" ? "color" : "backgroundColor"] = context.THEME.PAGES[page].buttonFocusColor === null ? context.DEFAULT_THEME.buttonFocusColor : context.THEME.PAGES[page].buttonFocusColor;
      })
      floatBoxItem.addEventListener("mouseout", function() {
        this.style[modifier == "color" ? "color" : "backgroundColor"] = context.THEME.PAGES[page].buttonColor === null ? context.DEFAULT_THEME.buttonColor : context.THEME.PAGES[page].buttonColor;
        items2[index].style[modifier == "backgroundColor" ? "color" : "backgroundColor"] = context.THEME.PAGES[page].buttonColor === null ? context.DEFAULT_THEME.buttonColor : context.THEME.PAGES[page].buttonColor;
      })
    })
  }


  /**
   * TEMPLATE
   */

  /**
   * Przgotowanie template dla kontenera buttonów
   *
   * @returns DOM object - template kontenera buttonów
   */
  buttonContainerTemplate() {

    return this.createDomElement(
        "div",
        {
          "class": [
            "scrolling-js-page-buttons-container"
          ]
        }
    );
  }

  /**
   * Przgotowanie template dla buttonów
   *
   * @returns DOM object - template buttonów
   */
  buttonTemplate(index) {
    let floatText = this.createDomElement(
        "div",
        {
          "class": [
            "scrolling-js-float-box", "hidden"
          ],
          "style": {
            transition: this.ANIMATION_DURATION ? ("all " + this.ANIMATION_DURATION + "ms") : ("none")
          }
        },
        this.INIT_PAGES[index].title
    );
    let innerLinkButton = this.createDomElement(
        "div",
        {
          "class": [
            "scrolling-js-link-button"
          ],
          "style": {
            transition: this.ANIMATION_DURATION ? ("all " + this.ANIMATION_DURATION + "ms") : ("none")
          }
        }
    );
    let linkButton = this.createDomElement(
        "div",
        {
          "class": [
            "scrolling-js-link-container"
          ],
          "counter": index.toString()
        },
        [
          floatText,
          innerLinkButton
        ]
    );
    linkButton.addEventListener("click", () => {
      if(!this.BLOCK_SCROLL) this.scrollPage(this.CONTAINER, this.COUNTER, index);
    });

    return linkButton;
  }

  /**
   * Przgotowanie template kontenera stron
   *
   * @returns DOM object - template kontenera stron
   */
  containerTemplate() {

    return this.createDomElement(
        "div",
        {
          "class": [
            "scrolling-js-container"
          ],
          "style": {
            height: this.INIT_PAGES.length * 100 + "%",
          }
        }
    );
  }

  /**
   * Przgotowanie template strony
   *
   * @param page - aktualna strona
   * @param subpages - wszystkie podstrony aktualnej strony
   * @param index - numer aktualnej strony
   *
   * @returns obj{
   * subpages - podstrony aktualnej strony
   * pageTemplate - template strony
   * index - numer aktualnej strony
   * domObject - element DOM źródła
   * page - aktualna strona
   * }
   */
  pageTemplate(page, index) {
    let domObject = this.getDomElements("id", page.id);
    domObject.classList.add("page")

    return {
      domObject: domObject,
      pageTemplate: this.createDomElement(
          "div",
          {
            "class": [
              "scrolling-js-page"
            ],
            "id": page.id,
            "title": this.checkVariable(page.title) ? page.title : "Default page title",
            "style": {
              backgroundColor: this.THEME.PAGES[index].backgroundColor,
              height: (100 / this.INIT_PAGES.length) + "%",
              backgroundImage: this.checkVariable(page.backgroundImage) ? pageTemplate.style.backgroundImage = "url(" + page.backgroundImage + ")" : "",
            }
          },
          domObject.cloneNode(true)
      ),
      page: page,
      index: index
    }
  }


  /**
   * OPCJE
   */

  /**
   * Blokowanie scroola jeżeli ustawiono opcję "blockScroll"
   *
   * @param blockScroll     - opcja ustawiana przy wywołaniu
   * @returns boolean       - jeżeli true to blokujemy scrollowanie
   */
  blockScroll({blockScroll}) {

    return this.checkVariable(blockScroll) ? blockScroll : false;
  }

  /**
   * Ładowanie styli CSS
   *
   * @param url - adres skąd pobierany jest arkusz CSS
   */
  CSSUploader(url) {
    document.getElementsByTagName("head")[0].appendChild(
        this.createDomElement("link", {
          "href": url,
          "type": "text/css",
          "rel": "stylesheet"
        })
    );
  }

  /**
   * Opracowanie prędkości animacji
   *
   * @param options       - wejściowy obiekt z opcjami
   * @param speed         - prędkość animacji (opcjonalnie)
   *
   * @returns {number}    - prędkość
   */
  animationSpeed(options, speed = 500) {
    if ((this.checkVariable(options.animationSpeed) && parseInt(options.animationSpeed) === 0) || (this.checkVariable(options.animationSpeed) && options.animationSpeed === "none") || (this.checkVariable(options.animationSpeed) && options.animationSpeed === false)) speed = 0;
    if (this.checkVariable(options.animationSpeed) && options.animationSpeed === "fast") speed = 150;
    if (this.checkVariable(options.animationSpeed) && options.animationSpeed === "slow") speed = 1000;
    if (this.checkVariable(options.animationSpeed) && parseInt(options.animationSpeed) > 0) speed = parseInt(options.animationSpeed);

    return speed;
  }

  /**
   /**
   * Strona startowa
   *
   * @param options
   */
  startingPage(startingPage) {
    if(this.checkVariable(startingPage) && !this.checkVariable(startingPage, "number") && this.PAGES.length >= startingPage) {
      this.CONTAINER.style.top = (-1) * (startingPage - 1) * this.CONTAINER.offsetHeight / this.INIT_PAGES.length + "px";
      this.COUNTER = startingPage - 1;
      this.activatePage(startingPage - 1)
      if(this.PAGE_TITLE.PAGE_TITLE) this.setPageTitle(this.PAGE_TITLE.PAGE_TITLE_PREFIX, this.PAGE_TITLE.PAGE_TITLE_SEPARATOR, this.PAGES[startingPage - 1].title);
    } else
      this.activatePage(0);
    this.pageButtons(this.TARGET);
    this.detectScroll();
  }

  /**
   * Wyświetlanie tytułu strony
   *
   * @param options - opcje startowe programu
   */
  pageTitle({pageTitle, pageTitlePrefix, pageTitleSeparator}) {

    return {
      PAGE_TITLE: (this.checkVariable(pageTitle) && pageTitle === true) ? true : false,
      PAGE_TITLE_PREFIX: this.checkVariable(pageTitlePrefix) ? pageTitlePrefix : false,
      PAGE_TITLE_SEPARATOR: this.checkVariable(pageTitleSeparator) ? pageTitleSeparator : false,
    };
  }

  /**
   * Ustawianie tytułu strony
   *
   * @param pagePrefix      - prefix podstrony
   * @param pageSeparator   - separator tekstów
   * @param pageTitle       - właściwy tytuł strony
   */
  setPageTitle(pagePrefix, pageSeparator, pageTitle) {
    document.title = `${pagePrefix ? pagePrefix + " " : ""}${pageSeparator ? pageSeparator + " " : ""}${pageTitle}`;
  }

  /**
   * Blokowanie wyświetlania przycisków
   *
   * @param buttons         - opcja undefined|true|false
   *
   * @returns {*|boolean}
   */
  setButtonsVisibility({buttons}) {

    return this.checkVariable(buttons) ? buttons : true;
  }


  /**
   * INTERAKCJA
   */
  /**
   * Ładowanie motywów
   *
   * @param theme             - pobrany motyw
   * @param themeDefault      - motyw domyślny
   * @param themeDefaultName  - nazwa motywu domyślnego (default = "THEME_LIGHT")
   */
  themeLoader(theme, themeDefault, themeDefaultName = "THEME_LIGHT") {
    let buttonColor, buttonFocusColor, backgroundColor;
    if(theme === "light") ({buttonColor, buttonFocusColor, backgroundColor} = this.THEME_LIGHT);
    else if(theme === "dark") ({buttonColor, buttonFocusColor, backgroundColor} = this.THEME_DARK);
    else if(theme !== null) {
      if(this.checkVariable(theme.buttonColor)) buttonColor = theme.buttonColor
      if(this.checkVariable(theme.buttonFocusColor)) buttonFocusColor = theme.buttonFocusColor;
      if(this.checkVariable(theme.backgroundColor)) backgroundColor = theme.backgroundColor;
    } else if(themeDefault === "light") ({buttonColor, buttonFocusColor, backgroundColor} = this.THEME_LIGHT);
    else if(themeDefault === "dark") ({buttonColor, buttonFocusColor, backgroundColor} = this.THEME_DARK);
    else if(themeDefault !== null) {
      if(this.checkVariable(themeDefault.buttonColor)) buttonColor = themeDefault.buttonColor;
      if(this.checkVariable(themeDefault.buttonFocusColor)) buttonFocusColor = themeDefault.buttonFocusColor;
      if(this.checkVariable(themeDefault.backgroundColor)) backgroundColor = themeDefault.backgroundColor;
    } else if(themeDefaultName === "THEME_LIGHT") ({buttonColor, buttonFocusColor, backgroundColor} = this.THEME_LIGHT);
    else if(themeDefaultName === "THEME_DARK") ({buttonColor, buttonFocusColor, backgroundColor} = this.THEME_DARK);

    return {
      buttonColor: buttonColor,
      buttonFocusColor: buttonFocusColor,
      backgroundColor: backgroundColor
    }
  }


  /**
   * POZOSTAŁE
   */

  /**
   * Dodawanie klasy do elementu DOM
   *
   * @param _class      - nazwa klasy do dodania
   * @param selector    - selektor DOM do wyszukania
   * @param number      - numer elementu DOM do dodania klasy (domyślnie "null" - dodawanie dla wszystkich)
   */
  addClass(_class, selector, number = null) {
    let elements = this.getDomElements("class", selector);
    if(number === null)
      elements.forEach((item) => item.classList.add(_class));
    else
      elements[number].classList.add(_class);
  }

  /**
   * Usuwanie klasy z elementu DOM
   *
   * @param _class      - nazwa klasy do usunięcia
   * @param selector    - selektor DOM do wyszukania
   * @param number      - numer elementu DOM do usunięcia klasy (domyślnie "null" - usuwanie dla wszystkich)
   */
  removeClass(_class, selector, number = null) {
    let elements = this.getDomElements("class", selector);
    if(number === null)
      elements.forEach((item) => item.classList.remove(_class));
    else
      elements[number].classList.remove(_class);
  }

  /**
   * Ustalenie animacji kontenera w zależnosci od zadeklarowanej prędkości
   *
   * @param container   - obiekt kontenera
   * @param speed       - prędkość animacji
   */
  animateContainer(container, speed) {
    container.style.transition = `all ${speed}ms`;
    setTimeout(() => {
      this.disableScrolling("end");
    }, speed)
  }

  /**
   * Spradzenie zmiennej czy jest danego typu
   * Domyślny sprawdzany typ to "undefined
   *
   * @param variable      - zmienna do sprawdzenia
   * @param type          - typ do sprawdzenia (domyślnie "undefined")
   * @returns {boolean}   - zwraca "true" gdy zmienna jest rożna od "type"
   */
  checkVariable(variable, type = "undefined") {
    return (typeof variable !== type) ? true : false;
  }

  /**
   *
   * Stylizowanie listy elementów DOM
   *
   * @param type        - typ zapytania DOM (class | id)
   * @param element     - zapytanie DOM
   * @param attribute   - atrybut CSS do przypisania
   * @param style       - style do wdrożenia
   */
  styleAllDomElements(type, element, attribute, style) {
    let elements = this.getDomElements(type, element);
    elements.forEach(element => element.style.transition = style);
  }

  /**
   *
   * Pobranie wszystkich elementów DOM
   *
   * @param type        - typ zapytania DOM (class | id)
   * @param element     - zapytanie DOM
   *
   * @returns {NodeListOf<*>|Node}
   */
  getDomElements(type, element) {
    let elements = document.querySelectorAll((type === "class" ? "." : "#") + element);

    return elements.length == 1 ? elements[0] : elements;
  }

  /**
   *
   * Tworzenie elementu DOM konkretnego typu z atrybutami, zawartością i dziećmi DOM
   *
   * @param type          - typ elementu DOM np. div
   * @param attributes    - atrybuty w formie obiektu
   *        attributes {
   *          "class": ["nazwaKlasy1", "nazwaKlasy2", ...],
   *          "style": {
   *            styl: wartość
   *          },
   *          inne w formie "nazwaAtrybutu": "wartośćAtrybutu"
   *        }
   * @param html          - zawartość HTML, dziecko w formie Node lub dzieci w formie [Nodes]
   *
   * @returns {*}         - nowy element DOM
   */
  createDomElement(type, attributes = {}, html = undefined) {
    let domElement = document.createElement(type);
    for(const [attributeName, attributeValue] of Object.entries(attributes))
      switch (attributeName) {
        case "class":
          attributeValue.forEach(className => domElement.classList.add(className));
          break;
        case "style":
          for(const [styleName, styleValue] of Object.entries(attributeValue)) domElement.style[styleName] = styleValue;
          break;
        default:
          domElement.setAttribute(attributeName, attributeValue);
          break;
      }
    if(this.checkVariable(html)) Array.isArray(html) ? html.forEach(child => domElement.append(child)) : domElement.append(html);

    return domElement;
  }

  /**
   * Blokowanie scrollowania dla aktywnego eventu typu scroll
   *
   * @param run           - typ start|end
   * @returns {boolean}
   */
  disableScrolling(run = null) {
    if(this.RUN === true) {
      if (run === "start")
        this.RUN = false;
      return true;
    } else {
      if(run === "end")
        this.RUN = true;
      return false;
    }
  }


  /**
   * SCROLLOWANIE
   */

  /**
   * Funkcja scrollująca
   *
   * @param page        - aktualna strona
   * @param nextPage    - strona do której ma zostać zescrollowane
   */
  scrollPage(scrollingContainer, page, nextPage) {
    if(this.disableScrolling("start")) {
      if(Math.abs(page - nextPage) > 1)
        this.animateContainer(this.CONTAINER, Math.abs(page - nextPage) * this.ANIMATION_DURATION);
      else
        this.animateContainer(this.CONTAINER, this.ANIMATION_DURATION);
      if(nextPage >= 0 && nextPage <= (this.PAGES.length - 1) && !this.BLOCK_SCROLL) {
        scrollingContainer.style.top = (-1) * nextPage * this.getDomElements("id", this.TARGET.getAttribute('id')).getBoundingClientRect().height + "px";
        if(this.PAGE_TITLE.PAGE_TITLE) this.setPageTitle(this.PAGE_TITLE.PAGE_TITLE_PREFIX, this.PAGE_TITLE.PAGE_TITLE_SEPARATOR, this.PAGES[nextPage].title);
        if(this.BUTTONS_VISIBLITY) this.buttons(nextPage);
        this.activatePage(nextPage);
        this.COUNTER = nextPage;
      } else if(nextPage < 0) this.COUNTER = 0;
      else if(nextPage > (this.PAGES.length - 1)) this.COUNTER = this.PAGES.length - 1;
    }
  }

  /**
   * Aktywowanie aktualnej strony
   * Dodanie akuratnych klas
   *
   * @param page - strona do oflagowania klasą active
   */
  activatePage(page) {
    let activePage = this.getDomElements("class", "page-active");
    if(activePage.length != 0)
      activePage.classList.remove("page-active");
    let pages = this.getDomElements("class", "page");
    pages[page].classList.add("page-active");
  }
}

/**
 * Export klasy scrollującej
 *
 * @param parameters
 */
function exportScrolling(parameters) {
  window.addEventListener("load", () => new scrollingClass(parameters));
}

export {exportScrolling as scrolling};
