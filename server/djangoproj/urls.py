# Diff 'tween url's in proj container and Django app:
# Django proj --> 
# Django App -->

"""djangoproj URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView # templateview allows for views and templates to be routed to and displayed as one/ static html page with logic from view function?
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [ # Here we give/ map the pages(now seen as views) we created to a url pattern (location), so they can be found. Declare to route. 
    # The pages being routed here as templates views are the external templates/pages (from 3d party frontend and not actual views from django app, hence they cannot be routed in the django urls file, so only apperar in the base urls file)
    path('admin/', admin.site.urls),
    path('djangoapp/', include('djangoapp.urls')),
    path('', TemplateView.as_view(template_name="Home.html")), 
    path('about/', TemplateView.as_view(template_name="About.html")),
    path('contact/', TemplateView.as_view(template_name="Contact.html")),
    path('login/', TemplateView.as_view(template_name="index.html")),
    path('logout/', TemplateView.as_view(template_name="index.html")),
    path('register/', TemplateView.as_view(template_name="index.html")),
    #path('frontend/', include('djangoapp.urls')),
    #path(('login/', views.login_request, name='login')),
 ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
