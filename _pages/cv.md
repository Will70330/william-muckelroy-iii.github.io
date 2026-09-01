---
layout: page
permalink: /cv/
title: cv
nav: true
nav_order: 6
description: My curriculum vitae — preview it below, or download the PDF.
---

{% assign cv_pdf = "/assets/pdf/MuckelroyIII_CV_v53_full.pdf" | relative_url %}

<div class="cv-pdf">
  <div class="cv-pdf-actions">
    <a class="cv-pdf-btn" href="{{ cv_pdf }}" download>
      <i class="fa-solid fa-download"></i> Download PDF
    </a>
    <a class="cv-pdf-btn" href="{{ cv_pdf }}" target="_blank" rel="noopener noreferrer">
      <i class="fa-solid fa-up-right-from-square"></i> Open in new tab
    </a>
  </div>

  <object class="cv-pdf-frame" data="{{ cv_pdf }}#view=FitH" type="application/pdf">
    <iframe class="cv-pdf-frame" src="{{ cv_pdf }}#view=FitH" title="Curriculum Vitae (PDF preview)">
      <p class="cv-pdf-fallback">
        Your browser does not support inline PDF previews.
        <a href="{{ cv_pdf }}" target="_blank" rel="noopener noreferrer">Download the PDF</a> instead.
      </p>
    </iframe>
  </object>
</div>
