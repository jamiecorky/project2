$(document).ready(function () {
  $('#add_button').click(function () {
    $('#user_form')[0].reset();
    $('.modal-title').text("Add User Details");
    $('#action').val("Add");
    $('#operation').val("Add")
  });

  const dataTable = $('#user_table').DataTable({
    "paging": true,
    "responsive": true,
    "fixedHeader": true,
    "processing": true,
    "order": [],
    "info": true,
    "ajax": {
      url: "libs/php/getAll.php",
      type: "GET"
    },
    "columnDefs": [
      {
        "targets": [0, 4],
        "orderable": false,
      },
    ],
  });

  //   "processing": true,
  //   "autoWidth": true,
  //   "columnDefs": [
  //     { "targets": [3], "orderable": false }
  //   ],


  //   "ajax": {
  //     "type": "",
  //     "url": "libs/php/getAll.php",
  //   },
  //   "columns": [
  //     { "data": "id" },
  //     { "data": "lastName" },
  //     { "data": "firstName" },
  //     { "data": "jobTitle" },
  //     { "data": "email" },
  //     { "data": "department" },
  //     { "data": "location" },
  //     { "data": "lastName" },
  //   ],
  // });


  $(document).on('submit', '#user_form', function (event) {
    event.preventDefault();
    const firstName = $('#firstname').val();
    const lastName = $('#lastname').val();
    const email = $('#email').val();
    const jobTitle = $('#jobtitle').val();
    const departmentID = $('#department').val();

    // Makes sure that the fields below are filled out before submitting
    if (firstName != '' && lastName != '' && email != '' && departmentID != '') {
      $.ajax({
        url: "libs/php/insertUser.php",
        method: 'POST',
        data: new FormData(this),
        contentType: false,
        processData: false,
        success: function (data) {
          $('#user_form')[0].reset();
          $('#userModal').modal('hide');
          dataTable.ajax.reload();
        }
      });
    }
    else {
      alert("First Name, Last Name, Email and Department are Required");
    }
  });

});