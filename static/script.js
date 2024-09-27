function toggleDropdown() {
    var dropdown = document.getElementById('dropdown-menu');

    // Check if dropdown is currently shown
    if (dropdown.classList.contains('show')) {
        dropdown.classList.add('hide'); // Start fade out

        // Set a timeout to completely hide the dropdown after the fade out
        setTimeout(function() {
            dropdown.classList.remove('show', 'hide'); // Remove classes to reset for next toggle
        }, 1000); // Match this timeout with the transition duration
    } else {
        //dropdown.classList.remove('hide'); // Ensure hide class is removed
        dropdown.classList.add('show'); // Start fade in
    }
}


document.querySelectorAll('.dropdown a').forEach(function(option) {
option.addEventListener('click', function() {
var dropdown = document.getElementById('dropdown-menu');
dropdown.classList.add('hide'); // Start fade out

// Set a timeout to completely hide the dropdown after the fade out
setTimeout(function() {
    dropdown.classList.remove('show', 'hide'); // Remove classes to reset for next toggle
}, 1000); // Match this timeout with the transition duration
    });
});

var url = "{{ url_for('static', filename='CV.pdf') }}";

var pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

// Asynchronously download the PDF
var loadingTask = pdfjsLib.getDocument(url);
loadingTask.promise.then(function(pdf) {
  console.log('PDF loaded');

  // Fetch the first page
  var pageNumber = 1;
  pdf.getPage(pageNumber).then(function(page) {
    console.log('Page loaded');

    var scale = 1.5;
    var viewport = page.getViewport({ scale: scale });

    // Prepare canvas using PDF page dimensions
    var canvas = document.getElementById('pdf-render');
    var context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render PDF page into canvas context
    var renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    var renderTask = page.render(renderContext);
    renderTask.promise.then(function () {
      console.log('Page rendered');
    });
  });
}, function (reason) {
  console.error(reason);
});