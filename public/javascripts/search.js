const bookTable = document.querySelector('table');

const searchForm = document.createElement('div');
searchForm.className = 'search';
searchForm.innerHTML = `
    <form action="/books" method="get">
        <h2>Search</h2>
        <p>Enter a title, author, genre or year to find matching books.</p>
        <input type="text" name="search" id="search">
        <input type="submit" value="submit">
    </form>
`;

if (bookTable) {
    bookTable.insertAdjacentElement('afterend', searchForm);
}

const doSearch = (query) => {
    console.log(`search for ${query}`);
}