from django.shortcuts import render

# Importe el decorador login_required
from django.contrib.auth.decorators import login_required

# Importe el decorador login_required
from django.contrib.auth.decorators import login_required, permission_required

# Create your views here.
from django.http import HttpResponse

# Importe requests y json
import requests
import json

# Importe para contar dias con mas entradas
from collections import defaultdict
from datetime import datetime



# Restricción de acceso con @login_required
@login_required
@permission_required('main.index_viewer', raise_exception=True)
def index(request):

    # Arme el endpoint del REST API
    current_url = request.build_absolute_uri()
    url = current_url + '/api/v1/landing'

    # Petición al REST API
    response_http = requests.get(url)
    response_dict = json.loads(response_http.content)

    # ----- ----- IMPRIME RESPUESTAS!!!!!
    #print("Endpoint ", url)
    #print("Response ", response_dict)

    # Diccionario para contar las respuestas por día
    day_counts = defaultdict(int)

    # Procesar cada respuesta
    for key, response in response_dict.items():
        join_time_str = response['joinTime']
        join_time = parse_join_time(join_time_str)
        # Extraer la fecha sin la hora
        join_date = join_time.date()
        # Contar las respuestas por día
        day_counts[join_date] += 1

    # Encontrar el día con más respuestas
    top_day = max(day_counts, key=day_counts.get)

    # Respuestas totales
    total_responses = len(response_dict.keys())

    #Respuestas Ordenadas
    sorted_responses = sorted(response_dict.items(), key=lambda x: x[1]["joinTime"])
    # Primera Respuesta
    first_responses = sorted_responses[0][1]['email']

    # Última Respuesta
    last_responses = sorted_responses[-1][1]['email']

    # Valores de la respuesta
    responses = response_dict.values()

    # Objeto con los datos a renderizar
    data = {
        'title': 'Landing - Dashboard',
        'total_responses': total_responses,
        'first_responses': first_responses,
        'last_responses': last_responses,
        'top_day': top_day,

        'responses': responses,
    }

    # return HttpResponse("Hello, World!")
    # return render(request, 'main/base.html')
    return render(request, 'main/index.html', data)

def parse_join_time(join_time_str):
    join_time_str = join_time_str.replace("\xa0", " ")
    join_time_str = join_time_str.replace("p. m.", "PM").replace("a. m.", "AM")
    return datetime.strptime(join_time_str, "%d/%m/%Y, %I:%M:%S %p")
