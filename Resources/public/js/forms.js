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
  $('.select2').not('.select2-container').not('.select2-offscreen').each(function() {
    var $this = $(this);
    var $tags = $(this).hasClass('tags');
    $this.select2({
        tags:  $tags,
        theme: 'bootstrap',
        width: 'resolve',
        minimumResultsForSearch: -1
    });
  });

  // Initialize file upload widget
  $(':file').on('fileselect', function(event, numFiles, label) {
    var $parent = $(this).parents('.input-group');
    $parent.find('.upload-current').addClass('hidden');
    $parent.find('.upload-deleted').addClass('hidden');
    $parent.find('.btn-file-delete').removeClass('active');
    $parent.find('.btn-file-delete').find(':checkbox').prop('checked', false);
    $parent.find('.upload-selected').html(label).removeClass('hidden');
  });

  $('.btn-file-delete').find(':checkbox').change(function() {
    var $this = $(this);
    var $parent = $this.parents('.input-group');
    if ($this.is(':checked')) {
      $parent.find('.upload-current').addClass('hidden');
      $parent.find('.upload-deleted').removeClass('hidden');
      $parent.find('.upload-selected').addClass('hidden');
      $parent.find(':file').val('');
    } else {
      $parent.find('.upload-current').removeClass('hidden');
      $parent.find('.upload-deleted').addClass('hidden');
      $parent.find('.upload-selected').addClass('hidden');
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
    $('.select2').not('.select2-container').not('.select2-offscreen').each(function() {
      var $this = $(this);
      var $tags = $(this).hasClass('tags');
      $this.select2({
        tags:  $tags,
        theme: 'bootstrap',
        width: 'resolve',
        minimumResultsForSearch: -1
      });
    });
  });
});
