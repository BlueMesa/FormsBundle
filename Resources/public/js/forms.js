/* 
 * Copyright 2013 Radoslaw Kamil Ejsmont <radoslaw@ejsmont.net>
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

$(document).on('change', ':file', function() {
  var input = $(this),
      numFiles = input.get(0).files ? input.get(0).files.length : 1,
      label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
  input.trigger('fileselect', [numFiles, label]);
});

$(document).ready(function () {
  // Initialize datepicker widgets
  $('.date').datepicker();

  // Initialize AJAX typeahead widgets
  $('.ajax-typeahead').each(function() {
    var $this = $(this);
    var url = $this.data('link') + '?query=%QUERY';
    var source = new Bloodhound({
      datumTokenizer: function(datum) {
        return Bloodhound.tokenizers.whitespace(datum.value);
      },
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      remote: {
        url: url,
        wildcard: '%QUERY',
        transform: function(list) {
          return $.map(list, function(value) { return { value: value }; });
        }
      }
    });
    $this.typeahead(null,{
      source: source,
      display: 'value'
    });
    $this.closest('.input-group').children('span.twitter-typeahead').css("display", "table-cell");
  });

  // Initialize select2 widgets
  $('.select2').not('.select2-container').not('.select2-offscreen').select2({
    width: 'resolve',
    minimumResultsForSearch: -1
  });

  $(':file').on('fileselect', function(event, numFiles, label) {
    var status = $(this).parents('.input-group').find('.form-control'),
        log = numFiles > 1 ? numFiles + ' files selected' : label;
    if( status.length ) {
      status.html(log);
    }
  });

  // Initialize widgets added dynamically by collection API
  $('body').off('click.collection.data-api', '[data-collection-add-btn]'
    ).on('click.collection.data-api', '[data-collection-add-btn]', function ( e ) {
    var $btn = $(e.target);
    if (!$btn.hasClass('btn')){
        $btn = $btn.closest('.btn');
    }
    $btn.collection('add');
    e.preventDefault();
    $('.date').datepicker();
    $('input.ajax-typeahead').not('.tt-hint').not('.tt-input').each(function() {
      var $this = $(this);
      var url = $this.data('link') + '?query=%QUERY';
      var source = new Bloodhound({
        datumTokenizer: function(d) { 
          return Bloodhound.tokenizers.whitespace(d.value); 
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
          url: url,
          wildcard: '%QUERY',
          transform: function(list) {
            return $.map(list, function(value) { return { value: value }; });
          }
        }
      });
      $this.typeahead(null,{
        source: source,
        display: 'value'
      });
      $this.closest('.input-group').children('span.twitter-typeahead').css("display", "table-cell");
    });
    $('.select2').not('.select2-container').not('.select2-offscreen').select2({
      width: 'resolve',
      minimumResultsForSearch: -1
    });
  });
});
