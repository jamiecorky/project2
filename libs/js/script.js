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

  $(document).on('submit', '#user_form', function (event) {
    event.preventDefault();
    const firstName = $('#firstname').val();
    const lastName = $('#lastname').val();
    const email = $('#email').val();
    const jobTitle = $('#jobtitle').val();
    const departmentID = $('#department').val();

    // Makes sure that the fields below are filled out before submitting
    if (firstName != '' && lastName != '' && email != '' && departmentID != '') {
      const userId = $(this).attr("id");
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

  $(document).on('click', '.update', function () {
    const userId = $(this).attr("id");

    $.ajax({
      url: "libs/php/getPersonnelByID.php",
      method: "POST",
      data: { id: userId },
      dataType: "json",
      success: function (data) {
        $('#userModal').modal('show');
        const result = data.data.personnel[0];
        console.log(result)
        $('#firstname').val(result.firstName);
        $('#lastname').val(result.lastName);
        $('#jobtitle').val(result.jobTitle);
        $('#email').val(result.email);
        $('#department').val(result.departmentID);
        $('.modal-title').text("Edit Course Details");
        $('#user-id').val(result.id);
        $('#action').val("Save");
        $('#operation').val("Edit");
      }
    });
  });

  $(document).on('click', '.delete', function () {
    const userId = $(this).attr("id");
    $.confirm({
      title: 'Delete User!',

      content: 'Are you sure you want to delete this user?<br>This action cannot be undone!',
      buttons: {

        confirm: {
          btnClass: 'btn-danger',
          action: function () {
            $.ajax({
              url: "libs/php/deleteUser.php",
              method: "POST",
              data: { id: userId },
              success: function (data) {
                dataTable.ajax.reload();
              }
            });
            $.alert('Deleted!');
          },
        },
        cancel: {
          btnClass: 'btn-secondary',
          action: function () {

          },
        }

      }
    });
  });

});