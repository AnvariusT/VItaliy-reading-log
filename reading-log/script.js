/* Get references to the form and table elements*/
const addBookForm     = document.getElementById("add-book-form");
const dateInput       = document.getElementById("date-input");
const titleInput      = document.getElementById("title-input");
const genreInput      = document.getElementById("genre-input");
const ratingInput     = document.getElementById("rating-input");
const booksTableBody  = document.querySelector("#books-table tbody");
const searchInput     = document.getElementById("search-input");

/*Time format*/
function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const month = "" + (d.getMonth() + 1); 
    const day   = "" + d.getDate();
    const year  = d.getFullYear();
    return [month, day, year].join("/");
  }

/*Fect cover image from Open Library*/
async function fetchCoverURL(bookTitle) {
  const query = encodeURIComponent(bookTitle);
  const response = await fetch(`https://openlibrary.org/search.json?title=${query}`);
  if (!response.ok) {
    return null;
  }
  const data = await response.json();

  // If we have at least one doc with a cover_i
  if (data.docs && data.docs.length > 0) {
    const firstDoc = data.docs[0];
    if (firstDoc.cover_i) {
      // Build the cover image URL
      return `https://covers.openlibrary.org/b/id/${firstDoc.cover_i}-M.jpg`;
    }
  }
  return null;
}

/*Handle form submission*/
addBookForm.addEventListener("submit", async function(e) {
    e.preventDefault();
  
    // Gather & format data
    const dateVal   = dateInput.value.trim();
    const titleVal  = titleInput.value.trim();
    const genreVal  = genreInput.value.trim();
    const ratingVal = ratingInput.value.trim(); // user rating
    
    const formattedDate = formatDate(dateVal);
  
    // Fetch cover from Open Library
    const coverURL = await fetchCoverURL(titleVal);
  
    // Create a new row
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>${formattedDate}</td>
      <td>${titleVal}</td>
      <td>${genreVal}</td>
      <td>${ratingVal || ""}</td>
      <td>
        ${
          coverURL
            ? `<img src="${coverURL}" alt="Cover for ${titleVal}" />`
            : "No cover found"
        }
      </td>
      <td>
        <select class="status-select">
          <option value="to-read" selected>To Read</option>
          <option value="middle">In the Middle of Reading</option>
          <option value="completed">Completed Reading</option>
        </select>
      </td>
      <td>
        <button class="actions-btn delete-btn">
          Delete
        </button>
      </td>
    `;
  
    // Append to table
    booksTableBody.appendChild(newRow);
  
    // Clear fields
    dateInput.value   = "";
    titleInput.value  = "";
    genreInput.value  = "";
    ratingInput.value = "";
  });

/* Table click events*/
booksTableBody.addEventListener("click", function(e) {
    //'e.target' is the actual element that was clicked
    const target = e.target;

    //check if teh delete button was clicked
    if(target.classList.contains("delete-btn")) {
        const row = target.closest("tr");
        row.remove();
            
        }
    });

/*Handle status changes via the dropdown*/
booksTableBody.addEventListener("change", function(e) {
    if(e.target.classList.contains("status-select")) {
        const newStatus = e.target.value;

        if(newStatus === "completed") {
            alert("Congrats! You finished reading this book.");
        }
    }
});

/*Search filter*/
searchInput.addEventListener("input", function() {
    const query = searchInput.value.toLowerCase();
    const rows = booksTableBody.querySelectorAll("tr");
  
    rows.forEach(row => {
      // Table structure:
      //   [0] = Date, [1] = Title, [2] = Genre, [3] = Rating, [4] = Cover, [5] = Status
      const dateCell   = row.cells[0].textContent.toLowerCase();
      const titleCell  = row.cells[1].textContent.toLowerCase();
      const genreCell  = row.cells[2].textContent.toLowerCase();
      const ratingCell = row.cells[3].textContent.toLowerCase();
      const coverCell  = row.cells[4].textContent.toLowerCase(); // might say "No cover found" or contain alt text
      const statusCell = row.cells[5].textContent.toLowerCase();
  
      if (
        dateCell.includes(query) ||
        titleCell.includes(query) ||
        genreCell.includes(query) ||
        ratingCell.includes(query) ||
        coverCell.includes(query) ||
        statusCell.includes(query)
      ) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
});
