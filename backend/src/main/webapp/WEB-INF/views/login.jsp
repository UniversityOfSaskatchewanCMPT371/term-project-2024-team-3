<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@page session="true"%>
<%--
  ~ Developed by Arastoo Bozorgi.
  ~ a.bozorgi67@gmail.com
  --%>


<html>
<head>
<title>Login Page</title>

	<!-- Required meta tags -->
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">

	<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
	<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>

	<c:url value="/resources/css/styles.css" var="myCSS" />
	<link rel="stylesheet" type="text/css" href="${myCSS}">

<style>

/*#login-box {*/
	/*width: 470px;*/
	/*padding: 20px;*/
	/*margin: 100px auto;*/
	/*background: #fff;*/
	/*-webkit-border-radius: 2px;*/
	/*-moz-border-radius: 2px;*/
	/*border: 1px solid #000;*/
/*}*/

.login-form {
	width: 340px;
	margin: 50px auto;
}
.login-form form {
	margin-bottom: 15px;
	background: #f7f7f7;
	box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
	padding: 30px;
}
.login-form h2 {
	margin: 0 0 15px;
}
.form-control, .btn {
	min-height: 38px;
	border-radius: 2px;
}
.btn {
	font-size: 15px;
	font-weight: bold;
}
</style>



</head>
<body>

	<div class="container" id="login-box">

		<div class="login-form">
			<form action="#">
				<h2 class="text-center">Log in</h2>
				<div class="form-group">
					<input type="text" class="form-control" id="username" placeholder="Username" required="required">
				</div>
				<div class="form-group">
					<input type="password" class="form-control" id="password" placeholder="Password" required="required">
				</div>
				<div class="form-group">
					<button type="submit" id="login-btn" class="btn btn-primary btn-block">Log in</button>
				</div>
				<div class="clearfix">
					<label class="pull-left checkbox-inline"><input type="checkbox"> Remember me</label>
					<a href="#" class="pull-right">Forgot Password?</a>
				</div>

				<div id="links" style="text-align: center;">
					<button id="applewatch-link" class="btn btn-outline-secondary" >Apple Watch</button>
					<button id="fitbit-link" class="btn btn-outline-secondary">Fitbit</button>
				</div>

				<div id="error" style="margin-top: 20px;" class="alert alert-danger" role="alert">
				</div>
			</form>
			<p class="text-center"><a href="#">Create an Account</a></p>
		</div>

			<%--<div class="form-group row">--%>
				<%--<label for="username" class="col-sm-2 col-form-label">Username</label>--%>
				<%--<div class="col-sm-10">--%>
					<%--<input type="text" class="form-control" id="username" placeholder="Username" required="required">--%>
				<%--</div>--%>
			<%--</div>--%>
			<%--<div class="form-group row">--%>
				<%--<label for="password" class="col-sm-2 col-form-label">Password</label>--%>
				<%--<div class="col-sm-10">--%>
					<%--<input type="password" class="form-control" id="password" placeholder="Password" required="required">--%>
				<%--</div>--%>
			<%--</div>--%>
			<%--<div class="form-group row">--%>
				<%--<div class="col-sm-10 offset-sm-2">--%>
					<%--<label class="form-check-label pull-left"><input type="checkbox"> Remember me</label>--%>
					<%--<a href="#" class="pull-right">Forgot Password?</a>--%>
				<%--</div>--%>
			<%--</div>--%>
			<%--<div class="form-group row">--%>
				<%--<div class="col-sm-10 offset-sm-2">--%>
					<%--<button id="login-btn" class="btn btn-primary">Sign in</button>--%>
				<%--</div>--%>
			<%--</div>--%>
			<%--<p class="text-center"><a href="#">Create an Account</a></p>--%>

			<%--<div id="links" style="text-align: center;">--%>
				<%--<button id="applewatch-link" class="btn btn-outline-secondary" >Apple Watch</button>--%>
				<%--<button id="fitbit-link" class="btn btn-outline-secondary">Fitbit</button>--%>
			<%--</div>--%>

			<%--<div id="error" style="margin-top: 20px;" class="alert alert-danger" role="alert">--%>
			<%--</div>--%>

		<script>

            $('#error').hide();
            $('#links').hide();
            $('#username').focus();

            // process the login button
            var loginButton = $('#login-btn');
            loginButton.click(function () {
                console.log('clicked');
                $('#error').hide();
                $('#links').hide();

                var username = $('#username').val();
                var password = $('#password').val();

                if (username == "" || password == "") {
                    var errorDiv = $('#error');
                    errorDiv.html("Please enter your username and password");
                    errorDiv.show();
                    return;
                }

                $.ajax({
                    type: 'POST',  // http method
                    url: '/loginuser',
                    data: {
                        username: username,
                        password: password
                    },
                    dataType: 'json',
                    success: function (data, status, xhr) {
                        console.log('status: ' + status + ', data: ' + data);
                        // login successful, load the applewatch view
                        // window.location.href = "beapengine/applewatch/upload"
						$('#links').show();
                    },
                    error: function (jqXhr, textStatus, errorMessage) {
                        $('#links').hide();
                        var result = JSON.parse(jqXhr.responseText);
                        var errorDiv = $('#error');
                        errorDiv.html(result.message);
                        errorDiv.show();
                    }
                });
            });


            $('#applewatch-link').click(function () {
                window.location.href = "rest/beapengine/applewatch/uploadview"
            });

            $('#fitbit-link').click(function () {
                window.location.href = "rest/beapengine/fitbit/uploadview"
            });

		</script>


	</div>


	<!-- Footer -->
	<div class="fixed-bottom navbar-dark bg-dark text-center py-3">
		<span style="color: white;"> © 2019 Copyright:</span>
		<a style="color: white;" href="http://www.beaplab.com/"> BEAPLab.com</a>
	</div>
	<!-- Footer -->

</body>
</html>