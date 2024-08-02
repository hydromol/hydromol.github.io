$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const property = urlParams.get('property');
    const minValue = parseFloat(urlParams.get('min-value'));
    const maxValue = parseFloat(urlParams.get('max-value'));
    let sortColumn = '';
    let sortOrder = 'asc';

    function sortData(data, column, order) {
        return data.sort((a, b) => {
            let valueA = a[column];
            let valueB = b[column];

            // Convert to numbers for numerical columns
            if (['mol_wt', 'RotationalconstantA', 'RotationalconstantB', 'RotationalconstantC', 'Dipolemoment', 'HOMO', 'LUMO', 'EnergyGap', 'Zeropointenergy', 'Finalsinglepointenergy', 'Totalthermalenergy', 'TotalEnthalpy', 'Totalentropy', 'Gibbsfreeenergy'].includes(column)) {
                valueA = parseFloat(valueA);
                valueB = parseFloat(valueB);
            }

            if (valueA < valueB) return order === 'asc' ? -1 : 1;
            if (valueA > valueB) return order === 'asc' ? 1 : -1;
            return 0;
        });
    }

    function renderTable(data) {
        const tableBody = $('#results-table tbody');
        tableBody.empty();

        $.each(data, function(index, molecule) {
            const row = $('<tr>');
            row.append($('<td>').html(`<a href="chemdata.html?search-input=${encodeURIComponent(molecule.smiles_format)}">${molecule.smiles_format}</a>`));
            row.append($('<td>').text(molecule.formula));
            row.append($('<td>').text(molecule.mol_wt));
            row.append($('<td>').text(molecule.pubchem_cid));
            row.append($('<td>').text(molecule.iupac_name));
            row.append($('<td>').text(molecule.RotationalconstantA));
            row.append($('<td>').text(molecule.RotationalconstantB));
            row.append($('<td>').text(molecule.RotationalconstantC));
            row.append($('<td>').text(molecule.Dipolemoment));
            row.append($('<td>').text(molecule.HOMO));
            row.append($('<td>').text(molecule.LUMO));
            row.append($('<td>').text(molecule.EnergyGap));
            row.append($('<td>').text(molecule.Zeropointenergy));
            row.append($('<td>').text(molecule.Finalsinglepointenergy));
            row.append($('<td>').text(molecule.Totalthermalenergy));
            row.append($('<td>').text(molecule.TotalEnthalpy));
            row.append($('<td>').text(molecule.Totalentropy));
            row.append($('<td>').text(molecule.Gibbsfreeenergy));

            tableBody.append(row);
        });
    }

    $.getJSON('hyd.json', function(data) {
        const filteredData = data.filter(function(molecule) {
            return molecule[property] >= minValue && molecule[property] <= maxValue;
        });

        if (filteredData.length > 0) {
            renderTable(filteredData);

            // Add click event listeners to sortable column headers
            $('#results-table th[data-sortable]').click(function() {
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
                $('#results-table th').removeClass('sort-asc sort-desc');
                $(this).addClass(sortOrder === 'asc' ? 'sort-asc' : 'sort-desc');
            });
        } else {
            window.location.href = '404.html';
        }
    }).fail(function() {
        console.error('Error fetching data.');
        $('#results-table tbody').append($('<tr>').append($('<td colspan="18">').text('Error fetching data.')));
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


