/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-7e5eb42b'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "pwa-maskable-512x512.png",
    "revision": "caf54a68be057094212c4fde55486603"
  }, {
    "url": "pwa-512x512.png",
    "revision": "9b91a3835104757200c6009fd15064e9"
  }, {
    "url": "pwa-192x192.png",
    "revision": "f035de4fd5ca220ad4c69bf34293570d"
  }, {
    "url": "index.html",
    "revision": "b497b672b7db70a600777aac36447fe4"
  }, {
    "url": "icon.svg",
    "revision": "d21824e678eb70540c4737a04df3f08d"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "43b87ccf96fa1f2bf8b6850052a2a35d"
  }, {
    "url": "assets/workbox-window.prod.es5-Bd17z0YL.js",
    "revision": null
  }, {
    "url": "assets/web-Fm6z4ats.js",
    "revision": null
  }, {
    "url": "assets/plus-jakarta-sans-latin-800-normal-CusIZhrK.woff2",
    "revision": null
  }, {
    "url": "assets/plus-jakarta-sans-latin-800-normal-BRNHt2w0.woff",
    "revision": null
  }, {
    "url": "assets/plus-jakarta-sans-latin-700-normal-DqEcQeE5.woff",
    "revision": null
  }, {
    "url": "assets/plus-jakarta-sans-latin-700-normal-CfpNZvy6.woff2",
    "revision": null
  }, {
    "url": "assets/plus-jakarta-sans-latin-600-normal-DLTa1BUW.woff2",
    "revision": null
  }, {
    "url": "assets/plus-jakarta-sans-latin-600-normal-BR_Ojra4.woff",
    "revision": null
  }, {
    "url": "assets/plus-jakarta-sans-latin-500-normal-DYtqi0QS.woff",
    "revision": null
  }, {
    "url": "assets/plus-jakarta-sans-latin-500-normal-Bf-nb4oT.woff2",
    "revision": null
  }, {
    "url": "assets/plus-jakarta-sans-latin-400-normal-Dhut76fR.woff2",
    "revision": null
  }, {
    "url": "assets/plus-jakarta-sans-latin-400-normal-BDKaGhyp.woff",
    "revision": null
  }, {
    "url": "assets/patient_trauma_lower_limb_1794868793279-hPyEv_-W.jpg",
    "revision": null
  }, {
    "url": "assets/patient_senior_trauma_hip_1794868793779-DubsVEGX.jpg",
    "revision": null
  }, {
    "url": "assets/patient_senior_male_care_1794863944246-CBBEh0rR.jpg",
    "revision": null
  }, {
    "url": "assets/patient_senior_female_care_1794863931218-CQRf6EqX.jpg",
    "revision": null
  }, {
    "url": "assets/patient_pregnant_care_1794863927003-B3eXqCl1.jpg",
    "revision": null
  }, {
    "url": "assets/patient_pediatric_clinic_1794863925914-CfRqX50h.jpg",
    "revision": null
  }, {
    "url": "assets/patient_male_respiratory_clinic_1794868788036-XhUIeH0o.jpg",
    "revision": null
  }, {
    "url": "assets/patient_male_abdominal_severe_1794868789152-ClsnGv60.jpg",
    "revision": null
  }, {
    "url": "assets/patient_infant_er_1794868785998-CNeXJA7L.jpg",
    "revision": null
  }, {
    "url": "assets/patient_female_headache_clinic_1794868790710-DpGx7xNu.jpg",
    "revision": null
  }, {
    "url": "assets/patient_female_chest_er_1794868787059-Buf9DmRV.jpg",
    "revision": null
  }, {
    "url": "assets/patient_female_abdominal_acute_1794868789216-Cdl_dBnO.jpg",
    "revision": null
  }, {
    "url": "assets/patient_ent_eye_care_1794868795742-CtPSypgh.jpg",
    "revision": null
  }, {
    "url": "assets/patient_dermatology_rash_1794868794882-DN1jIBOg.jpg",
    "revision": null
  }, {
    "url": "assets/patient_adult_male_er_1794863930039-DFMEDLG1.jpg",
    "revision": null
  }, {
    "url": "assets/patient_adult_male_clinic_1794863929411--gzAD-87.jpg",
    "revision": null
  }, {
    "url": "assets/patient_adult_lumbar_flank_1794868791852-CNBsOBuu.jpg",
    "revision": null
  }, {
    "url": "assets/patient_adult_headache_severe_1794868790013-B-EBInqA.jpg",
    "revision": null
  }, {
    "url": "assets/patient_adult_female_er_1794863929541-CSePlgxY.jpg",
    "revision": null
  }, {
    "url": "assets/patient_adult_female_clinic_1794863927386-DPdllm2m.jpg",
    "revision": null
  }, {
    "url": "assets/index-BAuOOSsu.css",
    "revision": null
  }, {
    "url": "assets/index-B2yztWqW.js",
    "revision": null
  }, {
    "url": "assets/ibm-plex-mono-latin-700-normal-CNHXzs6v.woff",
    "revision": null
  }, {
    "url": "assets/ibm-plex-mono-latin-700-normal-7sUh57Bg.woff2",
    "revision": null
  }, {
    "url": "assets/ibm-plex-mono-latin-600-normal-DWFSQ4vo.woff",
    "revision": null
  }, {
    "url": "assets/ibm-plex-mono-latin-600-normal-BgSNZQsw.woff2",
    "revision": null
  }, {
    "url": "assets/ibm-plex-mono-latin-500-normal-DSY6xOcd.woff2",
    "revision": null
  }, {
    "url": "assets/ibm-plex-mono-latin-500-normal-CB9ihrfo.woff",
    "revision": null
  }, {
    "url": "assets/ibm-plex-mono-latin-400-normal-DMJ8VG8y.woff2",
    "revision": null
  }, {
    "url": "assets/ibm-plex-mono-latin-400-normal-CvHOgSBP.woff",
    "revision": null
  }, {
    "url": "assets/aistudio/file_0000000059ac81f581ebdaf33c7f5eec_4d03af66.png",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "43b87ccf96fa1f2bf8b6850052a2a35d"
  }, {
    "url": "icon.svg",
    "revision": "d21824e678eb70540c4737a04df3f08d"
  }, {
    "url": "pwa-192x192.png",
    "revision": "f035de4fd5ca220ad4c69bf34293570d"
  }, {
    "url": "pwa-512x512.png",
    "revision": "9b91a3835104757200c6009fd15064e9"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "caf54a68be057094212c4fde55486603"
  }, {
    "url": "manifest.webmanifest",
    "revision": "90242d7a7b38ff45c67cbf3f54e294ec"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));

}));
