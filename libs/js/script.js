// Functions
$(window).on('load', function () {
  if ($('#preloader').length) {
    $('#preloader').delay(1000).fadeOut('slow', function () {
      $(this).remove();
    });
  }
});

(function () {
  'use strict'
  const forms = document.querySelectorAll('.requires-validation')
  Array.from(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()


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
        $('#filter_location').append(`<option selected value="">Location</option>`);
        // $('.loc-sel-default').append(`<option disabled selected value="">Select Location</option>`);
        for (let i = 0; i < result.data.length; i++) {
          $('.location-select').append(`<option value="${result.data[i].id}">${result.data[i].name}</option>`);
          $('.location-select-fil-per').append(`<option value="${result.data[i].id}">${result.data[i].name}</option>`);
          $('.location-select-fil-dep').append(`<option value="${result.data[i].id}">${result.data[i].name}</option>`);
          $('.location-select-add').append(`<option value="${result.data[i].id}">${result.data[i].name}</option>`);
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
    }
  });
}

function emptyLocations() {
  $(".location-select").empty();
  $(".location-select-fil-per").empty();
  $(".location-select-fil-dep").empty();
  $(".location-select-add").empty();

}

// Used to populate select options in Add/Edit personnel modal
function updateDepartments() {
  $.ajax({
    url: "libs/php/getAllDepartments.php",
    type: 'GET',
    dataType: 'json',
    success: function (result) {
      if (result.status.name == "ok") {
        $('#filter_department').append(`<option selected value="">Department</option>`);
        // $('.dep-sel-default').append(`<option disabled selected value="">Select Department</option>`);
        for (let i = 0; i < result.data.length; i++) {
          $('.department-select').append(`<option value="${result.data[i].id}">${result.data[i].name}</option>`);
          $('.department-select-fil-per').append(`<option value="${result.data[i].id}">${result.data[i].name}</option>`);
          $('.department-select-add').append(`<option value="${result.data[i].id}">${result.data[i].name}</option>`);
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
    }
  });
}

function emptyDepartments() {
  $(".department-select").empty();
  $(".department-select-fil-per").empty();
  $(".department-select-add").empty();
}

function fill_user_table(filter_department = '', filter_location = '') {
  let dataTable = $('#user_table').DataTable({
    "paging": false,
    "responsive": true,
    "fixedHeader": true,
    "processing": false,
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
        "targets": [2, 6, 7],
        "orderable": false,
      },
    ],
  });
}

function fill_dep_table(filter_location_dep = '') {
  dataTable = $('#dep_table').DataTable({
    "paging": false,
    "responsive": true,
    "fixedHeader": true,
    "processing": false,
    "searching": false,
    "order": [],
    "ajax": {
      url: "libs/php/getAllDepartmentsForTable.php",
      type: "POST",
      data: {
        filter_location: filter_location_dep,
      },
    }
  })
}

function fill_loc_table() {
  dataTable = $('#loc_table').DataTable({
    "paging": false,
    "responsive": true,
    "fixedHeader": true,
    "processing": false,
    "searching": false,
    "order": [],
    "ajax": {
      url: "libs/php/getAllLocationsForTable.php",
      type: "GET",
    }
  })
}

$(document).ready(function () {
  fill_user_table();
  updateLocations();
  updateDepartments();

  $('#filter').click(function () {
    var filter_department = $('#filter_department').val();
    var filter_location = $('#filter_location').val();
    if (filter_department != '' || filter_location != '') {
      $('#user_table').DataTable().destroy();
      fill_user_table(filter_department, filter_location);
    }
    else {
      $.alert({
        title: 'Try Again!',
        content: 'Select a department and/or location to filter the results first.',
      });
    }
  });

  $('.btn-info').click(function () {
    var filter_location_dep = $('#filter_location_dep').val();
    if (filter_location_dep != '') {
      $('#dep_table').DataTable().destroy();
      fill_dep_table(filter_location_dep);
    }
  });

  $('#reset').click(function () {
    $('#user_table').DataTable().destroy();
    fill_user_table();
    $('#dep_table').DataTable().destroy();
    fill_dep_table();
  });

  // When you click the personnel tab it updates the button and table
  $('#view-per').click(function () {
    $('.filter-search').show();
    $('.filter-search').find('*').show();
    $('.location-select-fil-per').attr('id', 'filter_location');
    $('#filterDep').attr('id', 'filter');
    $('.add-btns').attr('data-bs-target', '#userModal');
    $('.add-btns').html('Add User');
    $('.add-btns').attr('id', 'add-user-btn');
    $('#user_table').DataTable().destroy();
    fill_user_table();
  });

  // Opens department dataTable in modal from nav dropdown
  $('#view-dep').click(function () {
    $('#filter').attr('id', 'filterDep');
    $('.filter-search').find('*').show();
    $('.filter-search').show();
    $('.location-select-fil-per').attr('id', 'filter_location_dep');
    $('.department-select-fil-per').parent().hide();
    $('.add-btns').attr('data-bs-target', '#depModal');
    $('.add-btns').html('Add Department');
    $('.add-btns').attr('id', 'add-dep');
    $('#dep_table').DataTable().destroy();
    fill_dep_table();
  });

  // Opens location dataTable in modal from nav dropdown
  $('#view-loc').click(function () {
    $('.filter-search').children().hide();
    $('.filter-search').hide();
    $('#loc_table').DataTable().destroy();
    fill_loc_table();
    $('.add-btns').attr('data-bs-target', '#locModal');
    $('.add-btns').html('Add Location');
    $('.add-btns').attr('id', 'add-loc');

  });

  // Add User
  $(document).on('submit', '#user_form', function (event) {
    event.preventDefault();
    const firstName = $('#firstname').val();
    const lastName = $('#lastname').val();
    const email = $('#email').val();
    const jobTitle = $('#jobtitle').val();
    const departmentID = $('#department-select').val();

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
        $('#user_table').DataTable().destroy();
        fill_user_table()
      }
    });
  });

  // $('#cancel-add-user').click(function (event) {
  //   event.preventDefault();
  //   $.confirm({
  //     title: 'Cancel?',
  //     content: 'This form will be reset, do you still wish to cancel?',
  //     buttons: {
  //       yes: {
  //         btnClass: 'btn-primary',
  //         action: function () {
  //           $.alert('Cancelled!');
  //           $('#user_form')[0].reset();
  //           $('#userModal').modal('hide');
  //         },
  //       },
  //       no: {
  //         btnClass: 'btn-secondary',
  //         action: function () {
  //         },
  //       }
  //     }
  //   });
  // });

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
    if (firstName != '' && lastName != '' && jobTitle != '' && email != '' && departmentID != 'Select Department') {
      $.confirm({
        title: 'Update User?',
        content: `Are you sure you want to update the details of ${firstName} ${lastName}, all previous details will be replaced?`,
        buttons: {
          yes: {
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
                  $('#userEditModal').modal('hide');
                  $('#user_table').DataTable().destroy();
                  fill_user_table();
                }
              });
            },
          },
          no: {
            btnClass: 'btn-secondary',
            action: function () {
              $('#user_form')[0].reset();
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
          $('#user_table').DataTable().destroy();
          $('#dep_table').DataTable().destroy();
          fill_dep_table();
          fill_user_table();
          emptyDepartments();
          updateDepartments();
        }
      });
    }
    else {
      $.alert("Department Name and Location are Required");
    }
  });

  $('#cancel-add-department').click(function () {
    $('#dep_form')[0].reset();
  });

  // Adds location after filling form
  $(document).on('submit', '#loc_form', function (event) {
    event.preventDefault();
    emptyLocations();
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
          $('#user_table').DataTable().destroy();
          $('#dep_table').DataTable().destroy();
          $('#loc_table').DataTable().destroy();
          fill_loc_table();
          fill_dep_table();
          fill_user_table();
          updateLocations();
        }
      });
    }
    else {
      $.alert("Location is Required");
    }
  });

  $('#cancel-add-location').click(function () {
    $('#loc_form')[0].reset();
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
    $.ajax({
      url: "libs/php/getPersonnelByID.php",
      method: "POST",
      data: { id: userId },
      dataType: "json",
      success: function (data) {
        const result = data.data.personnel[0];
        const fName = result.firstName;
        const lName = result.lastName;
        $.confirm({
          title: 'Delete User?',
          content: `Are you sure you want to delete ${fName} ${lName}?`,
          buttons: {
            yes: {
              btnClass: 'btn-danger',
              action: function () {
                $.ajax({
                  url: "libs/php/deleteUser.php",
                  method: "POST",
                  data: { id: userId },
                  success: function (data) {
                    $('#user_table').DataTable().destroy();
                    fill_user_table()
                  }
                });
                $.alert('Deleted!');
              },
            },
            no: {
              btnClass: 'btn-secondary',
              action: function () {
              },
            }
          }
        });
      }
    });
  });

  // fills in the dep edit modal with this department info matching id.
  $(document).on('click', '.update-department', function () {
    const departmentId = $(this).attr("id");
    $.ajax({
      url: "libs/php/getDepartmentByID.php",
      method: "POST",
      data: { id: departmentId },
      dataType: "json",
      success: function (depData) {
        console.log(depData)
        const result = depData.data[0];
        $('#depEditModal').modal('show');
        $('#dep-edit-name').val(result.name);
        $('#loc-edit-select').val(result.locationID);
        $('#dep-id').val(result.id);
      }
    });
  });

  // Update department on submit
  $(document).on('submit', '#dep_edit_form', function (event) {
    event.preventDefault();
    const departmentName = $('#dep-edit-name').val();
    const locationID = $('#loc-edit-select').val();
    const depId = $('#dep-id').val();
    // Makes sure that the fields below are filled out before submitting
    if (departmentName == '') {
      $.alert({
        title: 'Cannot Update!',
        content: 'You must input new deparment name, or update the location.',
      });
    } else if (departmentName == '') {
      $.alert({
        title: 'Cannot Update!',
        content: 'You must input the new department name.',
      });
    } else {
      $.confirm({
        title: 'Update Department?',
        content: `Are you sure you want to update this department?<br>This action will update the details for all users in ${departmentName}.`,
        buttons: {
          Yes: {
            btnClass: 'btn-danger',
            action: function () {
              $.ajax({
                url: "libs/php/updateDepartment.php",
                method: "POST",
                data: {
                  depId: depId,
                  locId: locationID,
                  name: departmentName
                },
                dataType: "json",
                success: function (data) {
                  $('#dep_edit_form')[0].reset();
                  $('#depEditModal').modal('hide');
                  emptyDepartments();
                  $('#user_table').DataTable().destroy();
                  $('#dep_table').DataTable().destroy();
                  fill_dep_table();
                  fill_user_table();
                  updateDepartments();
                  $.alert('Updated!');
                }
              });
            },
          },
          No: {
            btnClass: 'btn-secondary',
            action: function () {
            },
          }
        }
      });
    }
  });

  // Checks count to make sure no users in department, then if 0 removes department then updates select.
  $(document).on('click', '.delete-department', function () {
    const departmentId = $(this).attr("id");
    $.ajax({
      url: "libs/php/countUsersInDepartment.php",
      method: "POST",
      dataType: "json",
      data: { id: departmentId },
      success: function (result) {
        if (result.data != '0') {
          $.alert({
            title: 'Unable To Delete!',
            content: 'There are still users in this department, remove the users first or change their department.',
          });
        } else {
          $.ajax({
            url: "libs/php/getDepartmentByID.php",
            method: "POST",
            data: { id: departmentId },
            dataType: "json",
            success: function (depData) {
              console.log(depData)
              const result = depData.data[0];
              const dName = result.name;
              $.confirm({
                title: 'Delete Department?',
                content: `Are you sure you want to delete ${dName}?`,
                buttons: {
                  yes: {
                    btnClass: 'btn-danger',
                    action: function () {
                      $.ajax({
                        url: "libs/php/deleteDepartment.php",
                        method: "POST",
                        data: { id: departmentId },
                        success: function (data) {
                          emptyDepartments();
                          $('#user_table').DataTable().destroy();
                          $('#dep_table').DataTable().destroy();
                          fill_dep_table();
                          fill_user_table();
                          updateDepartments();
                        }
                      });
                      $.alert('Department Deleted!');
                    },
                  },
                  no: {
                    btnClass: 'btn-secondary',
                    action: function () {
                    },
                  }
                }
              });
            }
          });
        }
      }
    })
  });

  // fills in the dep edit modal with this department info matching id.
  $(document).on('click', '.update-location', function () {
    const locationId = $(this).attr("id");
    $.ajax({
      url: "libs/php/getLocationByID.php",
      method: "POST",
      data: { id: locationId },
      dataType: "json",
      success: function (locData) {
        console.log(locData)
        const result = locData.data[0];
        $('#locEditModal').modal('show');
        $('#loc-edit-name').val(result.name);
        $('#loc-id').val(result.id);
      }
    });
  });

  // Update location on Submit
  $(document).on('submit', '#loc_edit_form', function (event) {
    event.preventDefault();
    const locId = $('#loc-id').val();
    const locName = $('#loc-edit-name').val();

    // Makes sure that the fields below are filled out before submitting
    if (locName == '') {
      $.alert({
        title: 'Cannot Update!',
        content: 'You must enter a new location name.',
      });
    } else {
      $.confirm({
        title: 'Update Location?',
        content: `Are you sure you want to update this location?<br>This action will update the location for all departments in ${locName}.`,
        buttons: {
          yes: {
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
                  emptyLocations();
                  $('#user_table').DataTable().destroy();
                  $('#dep_table').DataTable().destroy();
                  $('#loc_table').DataTable().destroy();
                  fill_loc_table();
                  fill_dep_table();
                  fill_user_table();
                  updateLocations();
                  $.alert('Updated!');
                }
              });
            },
          },
          no: {
            btnClass: 'btn-secondary',
            action: function () {
            },
          }
        }
      });
    }
  });

  // Deleting a location
  $(document).on('click', '.delete-location', function () {
    const locationId = $(this).attr("id");
    $.ajax({
      url: "libs/php/countDepartmentsInLocation.php",
      method: "POST",
      dataType: "json",
      data: { id: locationId },
      success: function (result) {
        if (result.data != "0") {
          $.alert({
            title: 'Unable To Delete!',
            content: 'There are still departments in this location , remove the departments first or change their location.',
          });
        } else {
          $.ajax({
            url: "libs/php/getLocationByID.php",
            method: "POST",
            data: { id: locationId },
            dataType: "json",
            success: function (locData) {
              const result = locData.data[0];
              const lName = result.name;
              $.confirm({
                title: 'Delete Location?',
                content: `Are you sure you want to delete ${lName}?`,
                buttons: {
                  yes: {
                    btnClass: 'btn-danger',
                    action: function () {
                      $.ajax({
                        url: "libs/php/deleteLocation.php",
                        method: "POST",
                        data: { id: locationId },
                        success: function (data) {
                          $('#user_table').DataTable().destroy();
                          $('#dep_table').DataTable().destroy();
                          $('#loc_table').DataTable().destroy();
                          fill_loc_table();
                          fill_dep_table();
                          fill_user_table();
                          emptyLocations();
                          updateLocations();
                        }
                      });
                      $.alert('Location Deleted!');
                    },
                  },
                  no: {
                    btnClass: 'btn-secondary',
                    action: function () {
                    },
                  }
                }
              });
            }
          });
        }
      }
    })
  });

});