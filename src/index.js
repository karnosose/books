class Books {
    constructor(auth) {
      this.auth = auth;
      this.container = document.querySelector("#container");
  
      if (this.auth.username === null) {
        this.auth.logInForm();
      } else {
        this.mainTemplate();
        this.auth.logOutListener();
        this.searchText = document.querySelector("#searchText");
        this.search = document.querySelector("#search");
        this.main = document.querySelector("#books");
        this.logo = document.querySelector(".logo");
        this.favoriteList = localStorage.getItem("favoriteList")
          ? JSON.parse(localStorage.getItem("favoriteList"))
          : {};
  
        this.searchBooks();
        this.getFavorites();
      }
    }
  
    searchBooks() {
      const self = this;
      this.search.addEventListener("click", e => {
        self.getBooks();
      });
    }
  
    getBooks() {
      const self = this;
  
      let search = searchText.value.split(" ").join("+");
      fetch(`https://openlibrary.org/search.json?q=${search}&limit=20`)
        .then(r => r.json())
        .then(r => {
          const books = r.docs;
          const bookItems = [];
          books.map(item => {
            let published = item.publish_year ? item.publish_year[0] : "no data";
            let author = item.author_name
              ? item.author_name.join(", ")
              : "no data";
  
            bookItems.push({
              id: item.key,
              title: item.title,
              author: author,
              published: published
            });
  
            self.addBooks(bookItems);
          });
        });
    }
  
    getFavorites() {
      const self = this;
      this.logo.addEventListener("click", () => {
        self.main.textContent = "";
        const favorites = JSON.parse(localStorage.getItem("favoriteList"));
        Object.keys(favorites).forEach(key => {
          self.createBooksDom(favorites[key]);
        });
      });
    }
  
    simpleTemplate(book) {
      const content = document.querySelector("#main");
      content.textContent = "";
  
      const bookSample = document.createElement("div");
      bookSample.setAttribute("id", "bookSample");
      const imgDiv = document.createElement("div");
      imgDiv.setAttribute("id", "imgDiv");
      const img = document.createElement("img");
      img.src = "./src/images/simplebook.jpg";
      const bookInfo = document.createElement("div");
      bookInfo.setAttribute("id", "bookInfo");
      const titleInfo = document.createElement("h3");
      titleInfo.textContent = `title: ${book.title}`;
      const authorInfo = document.createElement("p");
      authorInfo.textContent = `author: ${book.author}`;
      const dateInfo = document.createElement("p");
      dateInfo.textContent = `published date: ${book.date}`;
  
      content.appendChild(bookSample);
      bookSample.appendChild(imgDiv);
      bookSample.appendChild(bookInfo);
      imgDiv.appendChild(img);
      bookInfo.appendChild(titleInfo);
      bookInfo.appendChild(authorInfo);
      bookInfo.appendChild(dateInfo);
    }
  
    createBooksDom(book) {
      const self = this;
      const div = document.createElement("div");
      div.setAttribute("class", "book");
      const title = document.createElement("h2");
      title.setAttribute("class", "title");
      const author = document.createElement("p");
      author.setAttribute("class", "author");
      const year = document.createElement("p");
      year.setAttribute("class", "year");
      const favorites = document.createElement("div");
      favorites.setAttribute("class", "favorite");
      favorites.setAttribute("data-id", book.id);
      favorites.setAttribute("data-type", "off");
      const addFav = document.createElement("span");
      addFav.setAttribute("class", "addFav");
      const favIcon = document.createElement("span");
      favIcon.setAttribute("class", "favIcon");
  
      title.textContent = book.title;
      author.textContent = book.author;
      year.textContent = book.published;
      addFav.textContent = "add to favorites";
      favIcon.innerHTML = "&#9733;";
  
      if (book.id in this.favoriteList) {
        favIcon.style.color = "#27624e";
        favorites.classList.add("active");
      }
  
      favorites.appendChild(addFav);
      favorites.appendChild(favIcon);
      div.appendChild(author);
      div.appendChild(title);
      div.appendChild(year);
      div.appendChild(favorites);
      this.main.appendChild(div);
  
      favorites.addEventListener("click", e => {
        if (favorites.getAttribute("data-type") === "off") {
          favIcon.style.color = "#27624e";
          favorites.setAttribute("data-type", "on");
          favorites.classList.add("active");
  
          self.favoriteList[book.id] = book;
          localStorage.setItem("favoriteList", JSON.stringify(self.favoriteList));
        } else {
          favIcon.style.color = "white";
          favorites.setAttribute("data-type", "off");
          favorites.classList.remove("active");
  
          delete self.favoriteList[book.id];
  
          localStorage.setItem("favoriteList", JSON.stringify(self.favoriteList));
        }
      });
  
      title.addEventListener("click", e => {
        self.simpleTemplate(book);
      });
    }
  
    addBooks(books) {
      const self = this;
      this.main.textContent = "";
      books.map(book => {
        self.createBooksDom(book);
      });
    }
  
    mainTemplate() {
      this.container.textContent = "";
      const header = document.createElement("header");
      const main = document.createElement("div");
      main.setAttribute("id", "main");
      const logo = document.createElement("div");
      logo.setAttribute("class", "logo");
      const searchbox = document.createElement("div");
      searchbox.setAttribute("class", "searchbox");
      const books = document.createElement("div");
      books.setAttribute("id", "books");
      const p = document.createElement("p");
      p.textContent = "favorite books";
      const input = document.createElement("input");
      input.setAttribute("id", "searchText");
      input.type = "text";
      const button = document.createElement("button");
      button.setAttribute("id", "search");
      button.textContent = "search books";
      button.type = "submit";
  
      const logOut = document.createElement("button");
      logOut.setAttribute("class", "logout");
      logOut.textContent = "log out";
  
      const username = document.createElement("div");
      username.setAttribute("class", "username");
      username.textContent = this.auth.username;
  
      header.appendChild(logo);
      header.appendChild(searchbox);
      header.appendChild(username);
      header.appendChild(logOut);
  
      searchbox.appendChild(input);
      searchbox.appendChild(button);
      logo.appendChild(p);
  
      main.appendChild(books);
  
      this.container.appendChild(header);
      this.container.appendChild(main);
    }
  }
  
  class Auth {
    constructor() {
      this.username = localStorage.getItem("auth")
        ? JSON.parse(localStorage.getItem("auth")).username
        : null;
  
      this.form = document.createElement("form");
      this.nameInput = document.createElement("input");
      this.passInput = document.createElement("input");
      this.button = document.createElement("input");
      this.title = document.createElement("p");
    }
  
    logInListener() {
      const self = this;
      this.button.addEventListener("click", e => {
        if (self.nameInput.value !== "" && self.passInput.value !== "") {
          let auth = {
            username: self.nameInput.value
          };
          self.username = self.nameInput.value;
          localStorage.setItem("auth", JSON.stringify(auth));
          new Books(self);
        } else {
          const message = document.createElement("p");
          message.setAttribute("class", "message");
          message.textContent = "please fill all fields";
          this.form.appendChild(message);
        }
      });
    }
  
    logOutListener() {
      const self = this;
      const logout = document.querySelector(".logout");
      logout.addEventListener("click", () => {
        localStorage.removeItem("auth");
        self.username = null;
        new Books(self);
      });
    }
  
    logInForm() {
      document.querySelector("#container").textContent = "";
      const div = document.createElement("div");
      div.setAttribute("id", "form");
      this.title.setAttribute("class", "title");
      this.title.textContent = "log in to find books";
  
      this.nameInput.type = "text";
      this.nameInput.setAttribute("id", "name");
      this.nameInput.type = "text";
      this.nameInput.setAttribute("placeholder", "name");
      this.passInput.setAttribute("id", "pass");
      this.passInput.type = "password";
      this.passInput.setAttribute("placeholder", "password");
      this.button.type = "button";
      this.button.setAttribute("value", "log in");
      this.button.setAttribute("id", "login");
  
      container.appendChild(div);
      div.appendChild(this.title);
      div.appendChild(this.form);
      this.form.appendChild(this.nameInput);
      this.form.appendChild(this.passInput);
      this.form.appendChild(this.button);
  
      this.logInListener();
    }
  }
  
  const auth = new Auth();
  
  const book = new Books(auth);
  