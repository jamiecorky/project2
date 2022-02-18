<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/getAll.php

	// remove next two lines for production
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}	

	// SQL does not accept parameters and so is not prepared

	$query = 'SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, d.name as department, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) ORDER BY p.lastName, p.firstName, d.name, l.name';

	$result = $conn->query($query);
	
	if (!$result) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}
   
   	$data = array();

	foreach($result as $row) {

    $sub_array = array();

    $sub_array[] = $row["id"];
    $sub_array[] = $row["lastName"];
    $sub_array[] = $row["firstName"];
    $sub_array[] = $row["email"] . '<a href="mailto:' . $row["email"] . '"><button type="button" id="mail-btn" class="btn btn-secondary btn-sm fa-regular fa-envelope"></button></a>';
    $sub_array[] = $row["department"];
    $sub_array[] = $row["location"];
    $sub_array[] = $row["jobTitle"];
    $sub_array[] = '<button type="button" name="update" id="'.$row["id"].'" class="btn btn-primary btn-sm fa-solid fa-pen-to-square update-user"></button>';
    $sub_array[] = '<button type="button" name="delete" id="'.$row["id"].'" class="btn btn-danger btn-sm fa-solid fa-trash-can delete-user"></button>';
    $data[] = $sub_array;

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;
	
	mysqli_close($conn);

	echo json_encode($output); 

?>