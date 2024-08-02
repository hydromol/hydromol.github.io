$(document).ready(function() {
    const cInput = parseInt(new URLSearchParams(window.location.search).get('c-input'));
    const hInput = parseInt(new URLSearchParams(window.location.search).get('h-input'));
    let sortColumn = '';
    let sortOrder = 'asc';

    function sortData(data, column, order) {
        return data.sort((a, b) => {
            let valueA = a[column];
            let valueB = b[column];

            // Convert to numbers for numerical columns
            if (['mol_wt', 'pubchem_cid', 'Totalentropy', 'Gibbsfreeenergy'].includes(column)) {
                valueA = parseFloat(valueA);
                valueB = parseFloat(valueB);
            }

            if (valueA < valueB) return order === 'asc' ? -1 : 1;
            if (valueA > valueB) return order === 'asc' ? 1 : -1;
            return 0;
        });
    }

    function renderTable(data) {
        const tableBody = $('#molecule-table tbody');
        tableBody.empty();

        $.each(data, function(index, molecule) {
            const row = $('<tr>');
            row.append($('<td>').html(`<a href="chemdata.html?search-input=${encodeURIComponent(molecule.smiles_format)}">${molecule.smiles_format}</a>`));
            row.append($('<td>').text(molecule.formula));
            row.append($('<td>').text(molecule.mol_wt));
            row.append($('<td>').text(molecule.pubchem_cid));
            row.append($('<td>').text(molecule.iupac_name));
            row.append($('<td>').text(molecule.Totalentropy));
            row.append($('<td>').text(molecule.Gibbsfreeenergy));
            
            tableBody.append(row);
        });
    }

    $.getJSON('hyd.json', function(data) {
        const filteredData = data.filter(function(molecule) {
            const nameMatch = molecule.formula.toLowerCase().split(/c|h/);
            return parseInt(nameMatch[1]) === cInput && parseInt(nameMatch[2]) === hInput;
        });

        if (filteredData.length > 0) {
            renderTable(filteredData);

            // Add click event listeners to sortable column headers
            $('#molecule-table th[data-sortable]').click(function() {
                const column = $(this).data('column');
                if (sortColumn === column) {
                    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
                } else {
                    sortColumn = column;
                    sortOrder = 'asc';
                }

                const sortedData = sortData(filteredData, sortColumn, sortOrder);
                renderTable(sortedData);

                // Update sort indicators
                $('#molecule-table th').removeClass('sort-asc sort-desc');
                $(this).addClass(sortOrder === 'asc' ? 'sort-asc' : 'sort-desc');
            });
        } else {
            window.location.href = '404.html';
        }
    });
    
    // Auto-scroll functionality
    const tableContainer = $('.table-container');
    $(document).mousemove(function(event) {
        const windowWidth = $(window).width();
        const mouseX = event.pageX;
        const scrollSpeed = 30;
        
        if (mouseX < 50) {
            tableContainer.scrollLeft(tableContainer.scrollLeft() - scrollSpeed);
        } else if (mouseX > windowWidth - 50) {
            tableContainer.scrollLeft(tableContainer.scrollLeft() + scrollSpeed);
        }
    });
});