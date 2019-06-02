@extends('backend.layouts.app')

@section('title', app_name() . ' | ' . __('strings.backend.dashboard.title'))

@section('content')
    <div class="row">
        <div class="col s12 m12 l12">
            <div class="card">
                <div class="card-content">
                    <div class="card-title">
                        <strong>@lang('strings.backend.dashboard.welcome') {{ $logged_in_user->name }}!</strong>
                    </div><!--card-header-->
                    <div class="card-body">
                        {!! __('strings.backend.welcome') !!}
                    </div><!--card-body-->
                </div>
            </div><!--card-->
        </div><!--col-->
    </div><!--row-->
@endsection
