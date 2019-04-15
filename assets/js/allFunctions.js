var ENDPOINT_GITHUB_USER = "https://api.github.com/users/";
var REPOS = "/repos";
var STARRED = '/starred';
var nomeUsuarioGithub = '';

$('#form-pesquisa-usuario').submit(function(e) {
	showLoader();
	e.preventDefault();
	$('#container-pesquisa').find('p').remove();

	var usuario = $('#usuario').val();

	if(usuario === ''){
		$('#esconde-alert').show();
		hideLoader();
		return false;
	}

	pegarDadosUsuarioGitHub(usuario);

	$('#usuario').val("");

});

$('#btn-repos-usuario').click(function() {
	showLoader();
	$.ajax({
		'url': ENDPOINT_GITHUB_USER + nomeUsuarioGithub + REPOS, 
		'type': 'get',
		success: function(data) {
			hideLoader();
			$('#resultado-pesquisa').hide();
			$('#usuario-github-repos').text(nomeUsuarioGithub);
			$('#conteudo-resultado-pequisa-repos').show();

			if(data.length === 0) {
				$('#conteudo-resultado-repos').parent().hide();
				$('#conteudo-resultado-pequisa-repos h3').append(
					'<div class="text-center mt-5">'+
					'	<h4 class="text-danger">Este usuário não possui repósitorios</h4>'+
					'	<a href="index.html" class="btn btn-success">Voltar para a home</a>'+
					'</a>'
				);
			}

			for(var i = 0; i < data.length; i++){
				$('#conteudo-resultado-repos').append(
					'<tr>'+
					'	<th>' + data[i].name + '</th>'+
					'	<th>' + data[i].private + '</th>'+
					'</tr>'
				);
			}

		},
		error: function(data) {
			hideLoader();
			console.log(data)
		}
	});
});

$('#form-pesquisa-repos-usuario').submit(function(e) {
	e.preventDefault();

	$(this).find('p').remove();

	var usuarioRepo = $('#usuario-repo').val();

	if(usuarioRepo === ''){
		$(this).prepend('<p class="text-danger">Preencha os campos</p>');
		return false;
	}

	pegarRepositoriosUsuarioGitHub(usuarioRepo);

	$('#usuario').val("");

});

$('#btn-starred-usuario').click(function() {
	showLoader();
	$.ajax({
		url: ENDPOINT_GITHUB_USER + nomeUsuarioGithub + STARRED,
		type: 'get',
		success: function(data) {
			hideLoader();
			$('#resultado-pesquisa').hide();
			$('#conteudo-resultado-pequisa-starred').show();
			$('#usuario-github-starred').text(nomeUsuarioGithub);

			if(data.length === 0){
				$('#conteudo-resultado-pequisa-starred .table-responsive').hide();
				$('#conteudo-resultado-pequisa-starred  h3').append(
					'<div class="text-center">'+
					'	<h3 class="text-danger text-center mt-5">Usuário não possui repositórios estrelados</h3>'+
					'	<a href="index.html" class="btn btn-success">Volta para a home</a>'+
					'</div>'
				);
			}else {
				for(var i = 0; i < data.length; i++){
					$('#conteudo-resultado-starred').append(
						'<tr>'+
						'	<th>' + data[i].owner.login + '</th>' +
						'	<th>' + data[i].description + '</th>' +
						'</tr>'
					);
				}
			}
			
		},
		error: function(data) {
			console.log('Erro ao chamar repositórios estrelados do usuário' + data)
		}
	})
});

$('#usuario').click(function() {
	$('#esconde-alert, #usuario-nao-existe').hide();
});


$('#esconde-alert').click(function() {
	$(this).hide();
});

function pegarDadosUsuarioGitHub(usuario) {
	$.ajax({
		'url': ENDPOINT_GITHUB_USER + usuario, 
		'type': 'get',
		success: function(data) {
			hideLoader();
			$('#container-pesquisa').hide();
			$('#resultado-pesquisa').show();
			$('#usuario-github').text(data.login);

			nomeUsuarioGithub = data.login;
			data.bio === null ? data.bio = 'N/A' : data.bio;

			$('#login').text(data.login);
			$('#bio').text(data.bio);
			$('#following').text(data.following);
			$('#followers').text(data.followers);
			$('#created').text(formatDate(data.created_at, 'pt-br'));

		},
		error: function(data) {
			hideLoader();
			$('#container-pesquisa form').prepend('<p class="text-danger text-center" id="usuario-nao-existe">Usuário não existe</p>');
		}
	});
}

function pegarRepositoriosUsuarioGitHub(usuario) {
	$.ajax({
		'url': ENDPOINT_GITHUB_USER + usuario + REPOS, 
		'type': 'get',
		success: function(data) {
			$('#form-pesquisa-repos-usuario').hide();
			$('#resultado-pesquisa-repos').show();
			$('#modal-repos-aria').text('Registros encontrados: ')

			for(var i = 0; i < data.length; i++){
				$('#conteudo-resultado-usuario-repos').append(
					'<tr>'+
					'	<th>' + data[i].name + '</th>',
					'</tr>'
				);
			}

		},
		error: function(data) {
			$('#form-pesquisa-repos-usuario').prepend('<p class="text-danger">Usuário não existe</p>');
		}
	});
}

function showLoader() {
	$('body').append(
		'<div class="loader" id="loader">'+
		'	<div class="opacity-area"></div>'+
		'	<div class="text-center">'+
		'		<div class="spinner-grow text-primary" role="status">'+
		'			<span class="sr-only">Loading...</span>'+
		'		</div>'+
		'		<div class="spinner-grow text-danger" role="status">'+
		'			<span class="sr-only">Loading...</span>'+
		'		</div>'+
		'		<div class="spinner-grow text-success" role="status">'+
		'			<span class="sr-only">Loading...</span>'+
		'		</div>'+
		'		<div class="spinner-grow text-warning" role="status">'+
		'			<span class="sr-only">Loading...</span>'+
		'		</div>'+
		'	</div>'+
		'</div>'
	);
}

function hideLoader() {
	$('#loader').remove();
}

function formatDate(data, formato) {
  if (formato == 'pt-br') {
    return (data.substr(0, 10).split('-').reverse().join('/'));
  } else {
    return (data.substr(0, 10).split('/').reverse().join('-'));
  }
}




