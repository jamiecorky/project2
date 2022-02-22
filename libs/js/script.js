// Functions

// Stops form resubmit message on refresh caused by having select options on page even if they on default options
if (window.history.replaceState) {
  window.history.replaceState(null, null, window.location.href);
}

// Used to populate select options in Add/Edit department modal
function updateLocations() {
  $.ajax({
    url: "libs/php/getAllLocations.php",
    type: 'GET',
    dataType: 'json',
    success: function (result) {
      if (result.status.name == "ok") {
        for (let i = 0; i < result.data.length; i++) {
          $('.location-select').append(`<option value="${result.data[i].id}">${result.data[i].name}</option>`);
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

function fill_datatable(filter_department = '', filter_location = '') {
  dataTable = $('#user_table').DataTable({
    "paging": true,
    "responsive": true,
    "fixedHeader": true,
    "processing": true,
    // "serverSide": true,
    "order": [],
    "ajax": {
      url: "libs/php/getAll.php",
      type: "POST",
      data: {
        filter_department: filter_department,
        filter_location: filter_location,
      }
    },
    "columnDefs": [
      {
        "targets": [0, 3, 7, 8],
        "orderable": false,
      },
    ],
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

  fill_datatable();
  updateLocations();
  updateDepartments();

  $('#filter').click(function () {
    var filter_department = $('#filter_department').val();
    var filter_location = $('#filter_location').val();
    if (filter_department != '' || filter_location != '') {
      $('#user_table').DataTable().destroy();
      fill_datatable(filter_department, filter_location);
    }
    else {
      $.alert({
        title: 'Try Again!',
        content: 'Select a department and/or location to filter the results first.',
      });
      $('#user_table').DataTable().destroy();
      fill_datatable();
    }
  });

  // Add User
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
      $.alert("First Name, Last Name, Email and Department are Required");
    }
  });

  // Update user
  $(document).on('submit', '#user_edit_form', function (event) {
    event.preventDefault();
    const firstName = $('#firstname-edit').val();
    const lastName = $('#lastname-edit').val();
    const email = $('#email-edit').val();
    const jobTitle = $('#jobtitle-edit').val();
    const departmentID = $('.department-select').val();
    const userId = $('#user-edit-id').val();

    // Makes sure that the fields below are filled out before submitting
    if (firstName != '' && lastName != '' && email != '' && departmentID != 'Select Department') {
      $.confirm({
        title: 'Update User!',
        content: `Are you sure you want to update the details of this user, current details will be replaced?`,
        buttons: {
          confirm: {
            btnClass: 'btn-danger',
            action: function () {
              $.ajax({
                url: "libs/php/updateUser.php",
                method: 'POST',
                data: {
                  id: userId,
                  lastName: lastName,
                  firstName: firstName,
                  jobTitle: jobTitle,
                  email: email,
                  department: departmentID
                },
                success: function (data) {
                  $('#user_edit_form')[0].reset();
                  $('#userEditModal').modal('hide');
                  dataTable.ajax.reload();
                }
              });
            },
          },
          cancel: {
            btnClass: 'btn-secondary',
            action: function () {
            },
          }
        }
      });
    }
    else {
      $.alert("First Name, Last Name, Email and Department are Required");
    }
  });


  // Adds Department after filling form
  $(document).on('submit', '#dep_form', function (event) {
    event.preventDefault();
    $(".department-select").empty();
    $('#dep-action').val("Add");
    $('#dep-operation').val("Add");
    $('#dep-title').text("Add Department Details");
    const depName = $('#dep-name').val();
    const locID = $('.loc-select').val();

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
      $.alert("Department Name and Location are Required");
    }
  });

  // Adds location after filling form
  $(document).on('submit', '#loc_form', function (event) {
    event.preventDefault();
    $(".location-select").empty();
    $('#loc-action').val("Add");
    $('#loc-operation').val("Add");
    $('#loc-title').text("Add Location");
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
      $.alert("Location is Required");
    }
  });

  // Opens the update user modal and fills in the fields with the users current details
  $(document).on('click', '.update-user', function () {
    const userId = $(this).attr("id");
    $.ajax({
      url: "libs/php/getPersonnelByID.php",
      method: "POST",
      data: { id: userId },
      dataType: "json",
      success: function (data) {
        $('#userEditModal').modal('show');
        const result = data.data.personnel[0];
        $('#firstname-edit').val(result.firstName);
        $('#lastname-edit').val(result.lastName);
        $('#jobtitle-edit').val(result.jobTitle);
        $('#email-edit').val(result.email);
        $('.department-select').val(result.departmentID);
        $('#user-edit-id').val(result.id);
      }
    });
  });

  // Deletes a user by clicking the trash button
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

  // Updates the text field to match the selected department to edit to avoid users trying to change it to a blank field if only updating location
  $('#dep-select-edit').change(function () {
    $('#dep-edit-name').val($('#dep-select-edit option:selected').text());
  })


  // Department Form Edit on Submit
  $(document).on('submit', '#dep_edit_form', function (event) {
    event.preventDefault();

    const depId = $('#dep-select-edit').val();
    const depName = $('#dep-edit-name').val();
    const locId = $('#loc-edit-select').val();
    console.log(depId)
    console.log(depName)
    console.log(locId)

    // Makes sure that the fields below are filled out before submitting
    if (depName == '' && locId == null) {
      $.alert({
        title: 'Cannot Update!',
        content: 'You must input new deparment name, or update the location.',
      });
    } else if (depName == '') {
      $.alert({
        title: 'Cannot Update!',
        content: 'You must input the new department name.',
      });
    } else {
      $.confirm({
        title: 'Update Department!',
        content: `Are you sure you want to update this department?<br>This action will update the details for all users in ${$('#dep-select-edit option:selected').text()}!`,
        buttons: {
          confirm: {
            btnClass: 'btn-danger',
            action: function () {
              $.ajax({
                url: "libs/php/updateDepartment.php",
                method: "POST",
                data: {
                  depId: depId,
                  locId: locId,
                  name: depName
                },
                dataType: "json",
                success: function (data) {
                  $('#dep_edit_form')[0].reset();
                  $('#depEditModal').modal('hide');
                  $(".department-select").empty();
                  updateDepartments()
                  dataTable.ajax.reload();
                  $.alert('Updated!');
                }
              });
            },
          },
          cancel: {
            btnClass: 'btn-secondary',
            action: function () {
            },
          }
        }
      });
    }
  });

  // Checks count to make sure no users in department, then if 0 removes department then updates select.
  $(document).on('click', '#dep-del-btn', function (event) {
    event.preventDefault();
    const departmentId = $("#dep-sel").val();
    $.ajax({
      url: "libs/php/countUsersInDepartment.php",
      method: "POST",
      data: { id: departmentId },
      success: function (result) {
        if (result.data != "0") {
          $.alert({
            title: 'Unable To Delete!',
            content: 'There are still users in this department, remove the users first or change their department.',
          });
        } else {
          $.confirm({
            title: 'Delete Department!',
            content: 'Are you sure you want to delete this department?<br>This action cannot be undone!',
            buttons: {
              confirm: {
                btnClass: 'btn-danger',
                action: function () {
                  $.ajax({
                    url: "libs/php/deleteDepartment.php",
                    method: "POST",
                    data: { id: departmentId },
                    success: function (data) {
                      $('#dep_del_form')[0].reset();
                      $('#depDeleteModal').modal('hide');
                      dataTable.ajax.reload();
                      $("#dep-sel").empty();
                      updateDepartments();
                    }
                  });
                  $.alert('Department Deleted!');
                },
              },
              cancel: {
                btnClass: 'btn-secondary',
                action: function () {
                },
              }
            }
          });
        }
      }
    })
  });

  // Location Form Edit on Submit
  $(document).on('submit', '#loc_edit_form', function (event) {
    event.preventDefault();

    const locId = $('#loc-select-edit').val();
    const locName = $('#loc-edit-name').val();
    // console.log(locId)
    // console.log(locName)

    // Makes sure that the fields below are filled out before submitting
    if (locName == '' && locId == null) {
      $.alert({
        title: 'Cannot Update!',
        content: "You must select the location you wish to update, and input it's new name.",
      });
    } else if (locName == '') {
      $.alert({
        title: 'Cannot Update!',
        content: 'You must input the new location name.',
      });
    } else {
      $.confirm({
        title: 'Update Location!',
        content: `Are you sure you want to update this location?<br>This action will update the location of all ${$('#loc-select-edit option:selected').text()} departments!`,
        buttons: {
          confirm: {
            btnClass: 'btn-danger',
            action: function () {
              $.ajax({
                url: "libs/php/updateLocation.php",
                method: "POST",
                data: {
                  name: locName,
                  locId: locId
                },
                dataType: "json",
                success: function (data) {
                  $('#loc_edit_form')[0].reset();
                  $('#locEditModal').modal('hide');
                  $(".location-select").empty();
                  updateLocations()
                  dataTable.ajax.reload();
                  $.alert('Updated!');
                }
              });

            },
          },
          cancel: {
            btnClass: 'btn-secondary',
            action: function () {
            },
          }
        }
      });
    }
  });

  // Deleting a location
  $(document).on('click', '#loc-del-btn', function (event) {
    event.preventDefault();
    const locationId = $("#loc-sel").val();
    $.ajax({
      url: "libs/php/countDepartmentsInLocation.php",
      method: "POST",
      data: { id: locationId },
      success: function (result) {
        // console.log(result.data)
        if (result.data != "0") {
          $.alert({
            title: 'Unable To Delete!',
            content: 'There are still departments in this location , remove the departments first or change their location.',
          });
        } else {
          $.confirm({
            title: 'Delete Location!',
            content: 'Are you sure you want to delete this location?<br>This action cannot be undone!',
            buttons: {
              confirm: {
                btnClass: 'btn-danger',
                action: function () {
                  $.ajax({
                    url: "libs/php/deleteLocation.php",
                    method: "POST",
                    data: { id: locationId },
                    success: function (data) {
                      $('#loc_del_form')[0].reset();
                      $('#locDeleteModal').modal('hide');
                      dataTable.ajax.reload();
                      $("#loc-sel").empty();
                      updateLocations();
                    }
                  });
                  $.alert('Location Deleted!');
                },
              },
              cancel: {
                btnClass: 'btn-secondary',
                action: function () {
                },
              }
            }
          });
        }
      }
    })
  });

});