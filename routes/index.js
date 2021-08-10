const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Book = require('../models').Book;

/* Handler function to wrap each route with an async function. */
function asyncHandler(cb){
	return async(req, res, next) => {
		try {
	  		await cb(req, res, next)
		} catch(error){
	 	// Forward error to the global error handler
	  	next(error);
		}
  	}
}

/**
 * HOME 
 */
/* Home page redirects to books */
router.get('/', (req, res, next) => {
  	res.redirect('/books');
});

/* Show paginated list of books */
router.get('/books', asyncHandler(async (req, res) => {
	let page = req.query.p || 0;
	const booksPerPage = 10;
  	const books = await Book.findAndCountAll({ 
		limit: booksPerPage,
		offset: page * booksPerPage
	});
	const numOfPages = Math.ceil( books.count / booksPerPage );
  	res.render('books/index', { books: books.rows, title: 'Library Books', numOfPages });
}));

/**
 * SEARCH
 */
/* Search for books that match query from url */
router.get('/search', asyncHandler(async (req, res) => {
	const { query } = req.query;
	const queryMatch = { [Op.substring]: query };
	const books = await Book.findAll({
		where: { 
			[Op.or]: [
				{ title: queryMatch },
				{ author: queryMatch },
				{ genre: queryMatch },
				{ year: queryMatch } 
			]
		}
	});
	res.render('books/search-results', { books, query, title: 'Library Search'});
}));

/**
 * ADD NEW BOOKS
 */
/* Show the create new books form */
router.get('/books/new', (req, res, next) => {
  	res.render('books/new-book', { title: 'New Book' });
});

/* Post a new book object to the database */
router.post('/books/new', asyncHandler(async (req, res) => {
  	let book;
  	try {
		book = await Book.create(req.body);
		res.redirect('/books');
 	} catch (error) {
		if (error.name === 'SequelizeValidationError') {
	  		book = await Book.build(req.body);
	  		res.render('books/new-book', { book, errors: error.errors, title: 'New Book' });
		} else {
	  		throw error;
		}
  	}
}));

/**
 * UPDATE BOOKS
 */
/* Show book detail form */
router.get('/books/:id', asyncHandler(async (req, res) => {
  	const book = await Book.findByPk(req.params.id);
	res.render('books/update-book', { book, title: 'Update Book'});
}));

/* Update book info in the database */
router.post('/books/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect('/books');
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render('books/update-book', { book, errors: error.errors, title: 'Update Book' }) 
    }
  }
}));

/**
 * DELETE BOOKS
 */
/* Deletes a book */
router.post('/books/:id/delete', asyncHandler(async (req ,res) => {
	const book = await Book.findByPk(req.params.id);
	if (book) {
	  await book.destroy();
	  res.redirect("/books");
	} else {
	  res.sendStatus(404);
	}
}));

module.exports = router;
