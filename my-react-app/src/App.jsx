import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState(null);
  const booksPerPage = 10;

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await axios.get(
        "https://openlibrary.org/subjects/science_fiction.json?limit=100"
      );
      setBooks(response.data.works);
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    const results = books.filter((book) =>
      book.title.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredBooks(results);
  }, [books, search]);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  const closePopup = () => {
    setSelectedBook(null);
  };

  return (
    <div className="App">
      <h1>Book Gallery</h1>
      <input
        type="text"
        placeholder="Search for books..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="book-list">
        {currentBooks.map((book) => (
          <div key={book.key} className="card" onClick={() => handleBookClick(book)}>
            <img
              src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`}
              alt={book.title}
              className="card-img"
            />
            <h5 className="card-title">{book.title}</h5>
          </div>
        ))}
      </div>

      <div className="pagination">
        {[...Array(totalPages).keys()].map((number) => (
          <button
            key={number + 1}
            onClick={() => handlePageChange(number + 1)}
            className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}
          >
            {number + 1}
          </button>
        ))}
      </div>

      {selectedBook && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={closePopup}>&times;</span>
            <h2>{selectedBook.title}</h2>
            <img
              src={`https://covers.openlibrary.org/b/id/${selectedBook.cover_id}-L.jpg`}
              alt={selectedBook.title}
              className="popup-img"
            />
            <p><strong>Author:</strong> {selectedBook.authors ? selectedBook.authors.map(author => author.name).join(', ') : 'N/A'}</p>
            <p><strong>First Published:</strong> {selectedBook.first_publish_year || 'N/A'}</p>
            <p><strong>Subject:</strong> {selectedBook.subjects ? selectedBook.subjects.join(', ') : 'N/A'}</p>
            <p><strong>Description:</strong> {selectedBook.description || 'No description available.'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
