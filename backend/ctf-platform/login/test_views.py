from django.http import JsonResponse
from django.contrib.sites.models import Site

def test_site(request):
    sites = []
    for site in Site.objects.all():
        sites.append({
            'id': site.id,
            'domain': site.domain,
            'name': site.name
        })
    return JsonResponse({'sites': sites})