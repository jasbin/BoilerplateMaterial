<!DOCTYPE html>
<!--
Template Name: Materialize - Material Design Admin Template
Author: PixInvent
Website: http://www.pixinvent.com/
Contact: hello@pixinvent.com
Follow: www.twitter.com/pixinvents
Like: www.facebook.com/pixinvents
Purchase: https://themeforest.net/item/materialize-material-design-admin-template/11446068?ref=pixinvent
Renew Support: https://themeforest.net/item/materialize-material-design-admin-template/11446068?ref=pixinvent
License: You must have a valid license purchased only from themeforest(the above link) in order to legally use the theme for your project.

-->
<html class="loading" lang="en" data-textdirection="ltr">
<!-- BEGIN: Head-->

<head>
    @yield('meta')
    @stack('before-styles')
    {{ style(mix('css/backend.css')) }}
    @stack('after-styles')
    @include('backend.includes.meta')
</head>
<!-- END: Head-->
<body class="vertical-layout page-header-light vertical-menu-collapsible vertical-menu-nav-dark 2-columns  "
      data-open="click" data-menu="vertical-menu-nav-dark" data-col="2-columns">

@include('backend.includes.headers')
@include('backend.includes.sidenav')

<!-- BEGIN: Page Main-->
<div id="main">
    <div class="row">
        <div class="col s12">
            <div class="container animate fadeLeft">
                {!! Breadcrumbs::render() !!}
                @yield('content')
            </div>
        </div>
    </div>
</div>
<!-- END: Page Main-->

<!-- Theme Customizer -->

<a href="#"
   data-target="theme-cutomizer-out"
   class="btn btn-customizer pink accent-2 white-text sidenav-trigger theme-cutomizer-trigger"
><i class="material-icons">settings</i></a
>

@include('backend.includes.themecustomizer')

<!-- BEGIN: Footer-->
@include('backend.includes.footers')
<!-- END: Footer-->
<!-- BEGIN VENDOR JS-->

<!-- BEGIN THEME  JS-->

<script src="{{ asset('js/custom/custom-script.js') }}" type="text/javascript"></script>
@stack('before-scripts')
{!! script(mix('js/manifest.js')) !!}
{!! script(mix('js/vendor.js')) !!}
{!! script(mix('js/backend.js')) !!}
@stack('after-scripts')
<script src="{{ asset('js/vendors.min.js') }}" type="text/javascript"></script>
<script src="{{ asset('js/plugins.js') }}" type="text/javascript"></script>
<script src="{{ asset('js/scripts/customizer.js') }}" type="text/javascript"></script>

<!-- END THEME  JS-->
<!-- BEGIN PAGE LEVEL JS-->
<script src="{{ asset('js/scripts/dashboard-modern.js') }}" type="text/javascript"></script>
<!-- END PAGE LEVEL JS-->
</body>

</html>