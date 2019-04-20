from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.utils.safestring import mark_safe
import json


def redirect_to_index(request):
    return HttpResponseRedirect('/workspace/')


def index(request):
    return render(request, 'workspace/index.html', {})


def workspace(request, workspace_name):
    return render(request, 'workspace/workspace.html', {
        'workspace_name_json': mark_safe(json.dumps(workspace_name))
    })
