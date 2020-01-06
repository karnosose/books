class Books {
    constructor(){
        this.searchText = document.querySelector("#searchText");
        this.search = document.querySelector("#search");
        this.main = document.querySelector("#books");

        this.searchBooks();
    }

    searchBooks(){
        const self = this;
        this.search.addEventListener("click", e => {
            self.getBooks(1);
        });
    }  
    getBooks(page) {
        const self = this;

        // books.innerHTML = "";
    
        let search = searchText.value.split(" ").join("+");
        fetch(`https://openlibrary.org/search.json?q=${search}&page=${page}`)
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
                title: item.title,
                author: author,
                published: published
            });
    
            self.addBooks(  bookItems);
        });
        
        console.log(bookItems);
        const num = Math.ceil(r.numFound / 100);
            this.addPagination(num, page);
        });
    }

    addBooks(books) {
        const self = this;
        // console.log(books)
        books.map(book => {
            const div = document.createElement("div");
            div.setAttribute("class", "book");
            const title = document.createElement("h2");
            title.setAttribute("class", "title");
            const author = document.createElement("p");
            author.setAttribute("class", "author");
            const year = document.createElement("p");
            year.setAttribute("class", "year");

            title.textContent = book.title;
            author.textContent = book.author;
            year.textContent = book.published;

            div.appendChild(author);
            div.appendChild(title);
            div.appendChild(year);
            this.main.appendChild(div);


        });
        
    }

    addPagination(num, currentPage) {
    // remove existing pagination
        const oldPagination = document.querySelector(".pagination");
        if (oldPagination) {
            oldPagination.remove();
        }
        // console.log(document.getElementByClassName('.pagination'))
        const pagination = document.createElement("div");
        pagination.setAttribute("class", "pagination");
        for (let i = 1; i <= num; i++) {
            let div = document.createElement("div");
            div.setAttribute("class", "p-item");
            div.style.padding = "5px 10px";
            div.style.margin = "10px";
            div.style.display = "inline-block";
            div.style.cursor = "pointer";
            div.style.background = "#a0cda0";
        
            div.textContent = i;
            if (div.textContent == currentPage) {
            div.style.background = "orange";
            }
            pagination.appendChild(div);
        }
    
        document.body.appendChild(pagination);
    
        // add eventlistener for pagination
        this.paginate();
    }

    paginate() {
        let pagination = document.getElementsByClassName("p-item");
        
        Object.keys(pagination).forEach(key => {
            pagination[key].addEventListener("click", e => {
            getBooks(e.target.innerHTML);
            });
        });
    }
}

const book = new Books();

  // set multiple attributes to DOM object
//   function setAttributes(el, options) {
//     Object.keys(options).forEach(attr => el.setAttribute(attr, options[attr]));
//   }
  