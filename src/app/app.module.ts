import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';

import { MainLayoutComponent } from './core/components/main-layout/main-layout/main-layout.component';
import { LayoutModule } from "./core/components/layout/layout.module";
import { AuthComponent } from './core/components/auth/auth/auth.component';
import { HttpClientModule } from "@angular/common/http";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";

import {TruncatePipe} from "./core/utils/truncate.pipe";

@NgModule({
    declarations: [
        AppComponent,
        MainLayoutComponent,
        AuthComponent,
        TruncatePipe,
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        RouterModule.forRoot(AppRoutes, {useHash: true}),
        LayoutModule,
        HttpClientModule,
        RouterModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
        {
            provide: STEPPER_GLOBAL_OPTIONS,
            useValue: {displayDefaultIndicatorType: false}
        }
    ],
    exports: [
        TruncatePipe
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
