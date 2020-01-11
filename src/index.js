class Books {
    constructor(){
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

    searchBooks(){
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
            // let subject = item.subject
            // ? item.subject.splice(0, 5).join(", ")
            // : "no data";
            let published = item.publish_year ? item.publish_year[0] : "no data";
            let author = item.author_name ? item.author_name.join(", ") : "no data";
    
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

    getFavorites(){
        const self = this;
        this.logo.addEventListener("click", () => {
        const favorites = JSON.parse(localStorage.getItem("favoriteList"));
        Object.keys(favorites).forEach(key => {
            self.createBooksDom(favorites[key]);
        })
        })
    }

    createBooksDom(book){
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
        

        // hidden.textContent = book.id;
        title.textContent = book.title;
        author.textContent = book.author;
        year.textContent = book.published;
        addFav.textContent = "add to favorites";
        favIcon.innerHTML = "&#9733;";

        if (book.id in this.favoriteList){
            favIcon.style.color = "#27624e";
            favorites.style.display = "block";
        }

        favorites.appendChild(addFav);
        favorites.appendChild(favIcon);
        div.appendChild(author);
        div.appendChild(title);
        div.appendChild(year);
        div.appendChild(favorites);
        this.main.appendChild(div);

        favorites.addEventListener("click", e => {
            if (favorites.getAttribute("data-type") === "off"){
                favIcon.style.color = "#27624e";
                favorites.setAttribute("data-type", "on");
                favorites.style.display = "block";

                self.favoriteList[book.id] = book;
                localStorage.setItem("favoriteList", JSON.stringify(self.favoriteList));
            } else {
                favIcon.style.color = "white";
                favorites.setAttribute("data-type", "off");
                favorites.addEventListener("mouseout", () => {
                    favorites.style.display = "none";
                })
                favorites.addEventListener("mouseover", () => {
                    favorites.style.display = "block";
                })

                delete self.favoriteList[book.id];

                localStorage.setItem("favoriteList", JSON.stringify(self.favoriteList));
            }
        })
    }

    addBooks(books) {
        const self = this;
        this.main.textContent = "";
        books.map(book => {
            self.createBooksDom(book);
        });
    }

}

const book = new Books();
