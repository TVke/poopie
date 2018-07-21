<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Poopie</title>
    <link rel="stylesheet" href="{{ mix('/css/app.css') }}">
</head>
<body class="m-8">

<h1 class="font-sans text-center">Poopie</h1>

<p class="text-center">Your score: <strong id="score">0</strong></p>

<div id="game" class="my-8 mx-auto w-128 h-128 flex flex-wrap perspective relative">

</div>

<script src="{{ mix('/js/app.js') }}"></script>
</body>
</html>