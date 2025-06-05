"use strict";
let books = [];
// load array of books fro the local storage
let members = [];
let bookIdCounter = 1; // counter for book id
let memberIdCounter = 1; // counter for member id
let editignIndex = null;
// Get DOM elements
const bookTitleInput = document.getElementById("bookTitle");
const bookAuthorInput = document.getElementById("bookAuthor");
const addBookButton = document.getElementById("addBook");
const memberNameInput = document.getElementById("memberName");
const memberEmailInput = document.getElementById("memberEmail");
const memberPhoneInput = document.getElementById("memberPhone");
const addMemberButton = document.getElementById("addMember");
const borrowMemberSelect = document.getElementById("borrowMember");
const borrowBookSelect = document.getElementById("borrowBook");
const borrowButton = document.getElementById("borrowBookButton");
const returnBookButton = document.getElementById("returnBook");
const returnMemberSelect = document.getElementById("returnMember");
const returnBookMember = document.getElementById("returnBookMember");
//   function to clear input values for book inputs
const clearInputValues = () => {
    bookTitleInput.value = "";
    bookAuthorInput.value = "";
};
//   function to clear input values for member inputs
const clearMemberInputValues = () => {
    memberNameInput.value = "";
    memberEmailInput.value = "";
    memberPhoneInput.value = "";
};
// function to add a book
const addBook = () => {
    // get new input values
    const newBook = {
        title: bookTitleInput.value.trim(),
        author: bookAuthorInput.value.trim(),
    };
    // check if book already exists
    if (books.find((book) => book.title === newBook.title && book.author === newBook.author)) {
        alert("Book already exists");
        return;
    }
    // check if input field are empty before adding
    if (newBook.title === "" || newBook.author === "") {
        alert("Please fill in all fields");
        return;
    }
    // add new book to array
    books.push({
        title: newBook.title,
        author: newBook.author,
        borrowedBy: null,
        id: bookIdCounter++,
        status: "Not borrowed",
    });
    // store books in local storage
    clearInputValues();
    // call the method to display books
    displayBooks();
    populateBooksDropDown();
};
// function to populate books in the select dropdown
const populateBooksDropDown = () => {
    borrowBookSelect.innerHTML = "";
    books.forEach((book) => {
        const option = document.createElement("option");
        option.value = book.id.toString();
        option.textContent = book.title + " by " + book.author;
        borrowBookSelect.appendChild(option);
    });
};
// // function to populate members in the select dropdown
const populatemembersDropDown = () => {
    borrowMemberSelect.innerHTML = "";
    members.forEach((member) => {
        const memberOption = document.createElement("option");
        memberOption.value = member.id.toString();
        memberOption.textContent = member.name;
        borrowMemberSelect.appendChild(memberOption);
    });
};
// function to display books in table UI of books
const displayBooks = () => {
    const tableDisplay = document.querySelector("#booksDisplayTable tbody");
    tableDisplay.innerHTML = "";
    books.forEach((book, index) => {
        const actionsTd = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "deleteBtn";
        deleteButton.addEventListener("click", () => {
            books.splice(index, 1);
        });
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "editBtn";
        editButton.addEventListener("click", () => {
            // load book data into input fields
            bookTitleInput.value = book.title;
            bookAuthorInput.value = book.author;
            const upadeBook = {
                title: bookTitleInput.value,
                author: bookAuthorInput.value,
            };
            // check if book already exists before updating
            const existingBook = books.find((b) => b.title === upadeBook.title && b.author === upadeBook.author);
            if (existingBook) {
                alert("Book already exists");
                return;
            }
        });
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.status}</td>
            
        `;
        actionsTd.appendChild(editButton);
        actionsTd.appendChild(deleteButton);
        row.appendChild(actionsTd);
        tableDisplay.appendChild(row);
    });
};
// function to add a new member
const addMember = () => {
    const newMember = {
        name: memberNameInput.value.trim(),
        email: memberEmailInput.value.trim(),
        phone: memberPhoneInput.value.trim(),
        id: memberIdCounter++,
    };
    // check if input fields are empty
    if (!newMember.name || !newMember.email || !newMember.phone) {
        alert("Please fill in all fields");
        return;
    }
    // check if phone or email are duplicates
    if (members.some((member) => member.email === newMember.email || member.phone === newMember.phone)) {
        alert("Email or phone number already exists");
        return;
    }
    // add new member to members array
    members.push({
        id: bookIdCounter++,
        name: newMember.name,
        email: newMember.email,
        phone: newMember.phone,
        borrowedBooks: 0,
    });
    // store member data in local storage
    // clear input fields
    clearMemberInputValues();
    // call the method to display members
    displayMembers();
    populatemembersDropDown();
};
// function to display members in a table
const displayMembers = () => {
    const tableDisplay = document.querySelector("#membersDisplayTable tbody");
    tableDisplay.innerHTML = "";
    members.forEach((member, index) => {
        const actionsTd = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "deleteBtn";
        deleteButton.addEventListener("click", () => {
            members.splice(index, 1);
            displayMembers();
        });
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "editBtn";
        // add eventlistener to the edit button
        editButton.addEventListener("click", () => {
            // load the member data into the input fields
            memberNameInput.value = member.name;
            memberEmailInput.value = member.email;
            memberPhoneInput.value = member.phone;
            const updateMember = {
                id: member.id,
                name: memberNameInput.value,
                email: memberEmailInput.value,
                phone: memberPhoneInput.value,
            };
            // check for duplicates
            const duplicate = members.find((m) => {
                return (m.id !== member.id &&
                    m.name === updateMember.name &&
                    m.email === updateMember.email);
            });
            if (duplicate) {
                alert("Member already exists");
                return;
            }
        });
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${member.id}</td>
            <td>${member.name}</td>
            <td>${member.email}</td>
            <td>${member.phone}</td>
            <td>${member.borrowedBooks}</td>
        `;
        actionsTd.appendChild(deleteButton);
        actionsTd.appendChild(editButton);
        row.appendChild(actionsTd);
        tableDisplay.appendChild(row);
    });
};
// function to borrow a book
// array to store borrowed books
let borrowedBooks = [];
const borrowBook = (memberId, bookId) => {
    const member = members.find((m) => m.id === memberId);
    if (!member) {
        alert("Member not found");
        return;
    }
    const book = books.find((b) => b.id === bookId);
    if (!book) {
        alert("Book not found");
        return;
    }
    // Check if the book is already borrowed
    if (book.status === "Borrowed") {
        alert("This book is already borrowed");
        return;
    }
    // Mark book as borrowed
    book.status = "Borrowed";
    book.borrowedBy = member.id;
    // Add to borrowedBooks array
    borrowedBooks.push(book);
    // Increment member's borrowed book count
    member.borrowedBooks++;
    returnMemberDropdown();
    returnBookMemberDropdown();
};
// function to display members who have borrowed a book in a returnMember dropdown select
// array to store members who have borrowed a book
let membersWhoHaveBorrowed = [];
const returnMemberDropdown = () => {
    membersWhoHaveBorrowed = members.filter((member) => borrowedBooks.some((book) => book.borrowedBy === member.id));
    returnMemberSelect.innerHTML = "";
    membersWhoHaveBorrowed.forEach((member) => {
        const optionMember = document.createElement("option");
        optionMember.value = member.id.toString();
        optionMember.textContent = member.name || member.email;
        returnMemberSelect.appendChild(optionMember);
    });
    // store members to local storage
};
// function to display books which have been borrowed  in a returnBookMember dropdown select
// array to store members who have borrowed a book
let booksWhichHaveBeenBorrowed = [];
const returnBookMemberDropdown = () => {
    booksWhichHaveBeenBorrowed = books.filter((book) => book.status === "Borrowed");
    returnBookMember.innerHTML = "";
    booksWhichHaveBeenBorrowed.forEach((book) => {
        const optionBook = document.createElement("option");
        optionBook.value = book.id.toString();
        optionBook.textContent = book.title || book.author;
        returnBookMember.appendChild(optionBook);
    });
    // store members to the local storage
};
// function to return a book borrowed by a member
const returnBook = (bookId, memberId) => {
    const book = books.find((book) => book.id === bookId);
    if (book && book.status === "Borrowed" && book.borrowedBy === memberId) {
        book.status = "Not borrowed";
        book.borrowedBy = null;
        // Remove from borrowedBooks array
        const index = borrowedBooks.findIndex((book) => book.id === bookId);
        if (index !== -1) {
            borrowedBooks.splice(index, 1);
        }
        // Decrement member's borrowed book count
        const member = members.find((member) => member.id === memberId);
        if (member) {
            member.borrowedBooks--;
        }
        localStorage.setItem("books", JSON.stringify(books));
        returnBookMemberDropdown();
        returnMemberDropdown();
    }
};
returnBookButton.addEventListener("click", () => {
    const bookId = parseInt(returnBookMember.value);
    const memberId = parseInt(returnMemberSelect.value);
    if (isNaN(memberId) || isNaN(bookId)) {
        alert("Please select a book and a member");
    }
    returnBook(bookId, memberId);
    // store books in the local storage
});
// call the borrowBook function
borrowButton.addEventListener("click", () => {
    const memberId = parseInt(borrowMemberSelect.value);
    const bookId = parseInt(borrowBookSelect.value);
    if (isNaN(memberId) || isNaN(bookId)) {
        alert("Invalid input");
        return;
    }
    borrowBook(memberId, bookId);
});
addMemberButton.addEventListener("click", addMember);
addBookButton.addEventListener("click", addBook);
