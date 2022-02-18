// Functions

// Used to populate select options in Add/Edit department modal
function updateLocations() {
  $.ajax({
    url: "libs/php/getAllLocations.php",
    type: 'GET',
    dataType: 'json',
    success: function (result) {
      if (result.status.name == "ok") {
        console.log(result);
        for (let i = 0; i < result.data.length; i++) {
          $('#loc-select').append(`<option value="${result.data[i].id}">${result.data[i].name}</option>`);
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
    }
  });
}

// Used to populate select options in Add/Edit personnel modal
function updateDepartments() {
  $.ajax({
    url: "libs/php/getAllDepartments.php",
    type: 'GET',
    dataType: 'json',
    success: function (result) {
      if (result.status.name == "ok") {
        console.log(result);
        for (let i = 0; i < result.data.length; i++) {
          $('.department-select').append(`<option value="${result.data[i].id}">${result.data[i].name}</option>`);
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
    }
  });
}

$(document).ready(function () {
  //Fix these
  $('#add-user-btn').click(function () {
    $('#user_form')[0].reset();
    $('#dep_form')[0].reset();
    $('#user-title').text("Add User Details");
    $('#action').val("Add");
    $('#operation').val("Add");
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
        "targets": [0, 3],
        "orderable": false,
      },
    ],
  });

  updateLocations();
  updateDepartments();


  $(document).on('submit', '#user_form', function (event) {
    event.preventDefault();
    const firstName = $('#firstname').val();
    const lastName = $('#lastname').val();
    const email = $('#email').val();
    const jobTitle = $('#jobtitle').val();
    const departmentID = $('#department-select').val();

    // Makes sure that the fields below are filled out before submitting
    if (firstName != '' && lastName != '' && email != '' && departmentID != 'Select Department') {
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

  $(document).on('submit', '#dep_form', function (event) {
    event.preventDefault();
    $(".department-select").empty();
    $('#dep-action').val("Add");
    $('#dep-operation').val("Add");
    $('#dep-title').text("Add Department Details");
    const depName = $('#dep-name').val();
    const locID = $('#loc-select').val();

    // Makes sure that the fields below are filled out before submitting
    if (depName != '' && locID != 'Select Location') {
      const userId = $(this).attr("id");
      $.ajax({
        url: "libs/php/insertDepartment.php",
        method: 'POST',
        data: new FormData(this),
        contentType: false,
        processData: false,
        success: function (data) {
          $('#dep_form')[0].reset();
          $('#depModal').modal('hide');
          dataTable.ajax.reload();
          updateDepartments()
        }
      });
    }
    else {
      alert("Department Name and Location are Required");
    }
  });

  // Location form
  $(document).on('submit', '#loc_form', function (event) {
    event.preventDefault();
    $("#loc-select").empty();
    $('#loc-action').val("Add");
    $('#loc-operation').val("Add");
    $('#loc-title').text("Add Location Details");
    const locName = $('#loc-name').val();

    // Makes sure that the fields below are filled out before submitting
    if (locName != '') {
      const userId = $(this).attr("id");
      $.ajax({
        url: "libs/php/insertLocation.php",
        method: 'POST',
        data: new FormData(this),
        contentType: false,
        processData: false,
        success: function (data) {
          $('#loc_form')[0].reset();
          $('#locModal').modal('hide');
          dataTable.ajax.reload();
          updateLocations();
        }
      });
    }
    else {
      alert("Location is Required");
    }
  });

  $(document).on('click', '.update-user', function () {
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
        $('.department-select').val(result.departmentID);
        $('#user-title').text("Edit User Details");
        $('#user-id').val(result.id);
        $('#action').val("Save");
        $('#operation').val("Edit");
      }
    });
  });

  $(document).on('click', '.delete-user', function () {
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

  $(document).on('click', '#dep-del-btn', function (event) {
    event.preventDefault();
    const depID = $("#dep-sel").val();

    $.ajax({
      url: "libs/php/countUsersInDepartment.php",
      method: "POST",
      data: { id: depID },
      success: function (data) {
        console.log(data)
        alert("yes")
      }
    })





    // $.confirm({
    //   title: 'Delete User!',
    //   content: 'Are you sure you want to delete this user?<br>This action cannot be undone!',
    //   buttons: {
    //     confirm: {
    //       btnClass: 'btn-danger',
    //       action: function () {
    //         $.ajax({
    //           url: "libs/php/deleteUser.php",
    //           method: "POST",
    //           data: { id: userId },
    //           success: function (data) {
    //             dataTable.ajax.reload();
    //           }
    //         });
    //         $.alert('Deleted!');
    //       },
    //     },
    //     cancel: {
    //       btnClass: 'btn-secondary',
    //       action: function () {
    //       },
    //     }
    //   }
    // });
  });

});