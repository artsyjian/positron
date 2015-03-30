Backbone = require 'backbone'
gemup = require 'gemup'
sd = require('sharify').data
thumbnailFormTemplate = -> require('./form.jade') arguments...

module.exports = class EditThumbnail extends Backbone.View

  initialize: (options) ->
    { @article } = options
    @article.on 'change:thumbnail_image', @renderThumbnailForm
    @article.on 'change:title', _.debounce @prefillThumbnailTitle, 3000
    @checkTitleTextarea()

  renderThumbnailForm: =>
    @$('#edit-thumbnail-inputs-left').html thumbnailFormTemplate
      article: @article

  prefillThumbnailTitle: =>
    console.log @article.get('title') and not @article.get('thumbnail_title')
    if @article.get('title') and not @article.get('thumbnail_title')
      @useArticleTitle()

  events:
    'change #edit-thumbnail-image': 'uploadThumbnail'
    'drop #edit-thumbnail-upload': 'toggleThumbnailDragover'
    'click #edit-thumbnail-remove': 'removeThumbnail'
    'click .edit-use-article-title': 'useArticleTitle'
    'change .edit-title-textarea': 'checkTitleTextarea'

  uploadThumbnail: (e) ->
    gemup e.target.files[0],
      key: sd.GEMINI_KEY
      progress: (percent) =>
        @$('#edit-thumbnail-upload .upload-progress-container')
          .show().find('.upload-progress').width "#{percent * 100}%"
        @$('#edit-thumbnail-preview').css opacity: percent
      add: (src) =>
        @article.set 'thumbnail_image', src
        @$('#edit-thumbnail-preview').css opacity: 0.1
        @$('#edit-thumbnail-upload').addClass 'is-uploading'
      done: (src) =>
        img = new Image()
        img.src = src
        img.onload = =>
          @article.save thumbnail_image: src
          @$('#edit-thumbnail-upload .upload-progress-container').hide()
          @$('#edit-thumbnail-upload').removeClass 'is-uploading'

  removeThumbnail: (e) ->
    e.preventDefault()
    @article.save thumbnail_image: null

  useArticleTitle: (e) ->
    e?.preventDefault()
    @$('.edit-use-article-title').next().val(@article.get('title'))
    @$('.edit-use-article-title').hide()
    @article.save thumbnail_title: @article.get('title')

  checkTitleTextarea: ->
    if $('.edit-title-textarea').val() is @article.get('title')
      $('.edit-use-article-title').hide()
    else
      $('.edit-use-article-title').show()
