/**
 * OnlyOffice SDK Entry Point
 * This file loads the appropriate SDK based on document type
 * 
 * Usage:
 * <script src="/office/sdk.js"></script>
 * 
 * Then use:
 * - Asc.word for Word documents
 * - Asc.cell for Excel spreadsheets
 * - Asc.slide for PowerPoint presentations
 */
(function(global) {
    'use strict';

    var SDK = {
        version: '7.4.1',
        loaded: false,
        scriptsLoaded: {
            word: false,
            cell: false,
            slide: false
        }
    };

    // Get file type from extension
    function getFileType(fileName) {
        if (!fileName) return 'word';
        var ext = fileName.split('.').pop().toLowerCase();
        
        var wordExts = ['docx', 'doc', 'odt', 'txt', 'rtf', 'pdf', 'dot', 'dotx', 'fodt', 'ott', 'epub', 'html', 'mht'];
        var cellExts = ['xlsx', 'xls', 'ods', 'csv', 'xltx', 'xlt', 'fods', 'ots'];
        var slideExts = ['pptx', 'ppt', 'odp', 'potx', 'pot', 'fodp', 'otp'];
        
        if (wordExts.indexOf(ext) !== -1) return 'word';
        if (cellExts.indexOf(ext) !== -1) return 'cell';
        if (slideExts.indexOf(ext) !== -1) return 'slide';
        
        return 'word';
    }

    // Load a specific editor SDK
    function loadEditorSdk(type, callback) {
        var scriptPath = '';

        switch (type) {
            case 'word':
            case 'docx':
            case 'doc':
            case 'odt':
            case 'txt':
            case 'rtf':
            case 'pdf':
                type = 'word';
                scriptPath = '/office/sdkjs/word/sdk-all-min.js';
                break;
            case 'cell':
            case 'xlsx':
            case 'xls':
            case 'ods':
            case 'csv':
                type = 'cell';
                scriptPath = '/office/sdkjs/cell/sdk-all-min.js';
                break;
            case 'slide':
            case 'pptx':
            case 'ppt':
            case 'odp':
                type = 'slide';
                scriptPath = '/office/sdkjs/slide/sdk-all-min.js';
                break;
            default:
                type = 'word';
                scriptPath = '/office/sdkjs/word/sdk-all-min.js';
        }

        // Check if already loaded
        if (SDK.scriptsLoaded[type]) {
            callback && callback(global.Asc || global);
            return;
        }

        var script = document.createElement('script');
        script.src = scriptPath;
        script.onload = function() {
            SDK.scriptsLoaded[type] = true;
            SDK.loaded = true;
            callback && callback(global.Asc || global);
        };
        script.onerror = function() {
            console.error('Failed to load SDK:', scriptPath);
            callback && callback(null, new Error('Failed to load SDK: ' + scriptPath));
        };
        document.head.appendChild(script);
    }

    // Load all SDKs (word, cell, slide)
    function loadAllSdks(callback) {
        var loaded = 0;
        var total = 3;
        var error = null;

        function onSdkLoaded(type, err) {
            if (err) {
                error = err;
            }
            loaded++;
            if (loaded >= total) {
                SDK.loaded = true;
                callback && callback(error, global.Asc || global);
            }
        }

        loadEditorSdk('word', function() { onSdkLoaded('word'); });
        loadEditorSdk('cell', function() { onSdkLoaded('cell'); });
        loadEditorSdk('slide', function() { onSdkLoaded('slide'); });
    }

    // Initialize OnlyOffice Document Editor (Word)
    function initDocumentEditor(container, config) {
        if (!global.Asc || !global.Asc.Docs || !global.Asc.Docs.Api) {
            throw new Error('OnlyOffice Word SDK not loaded');
        }

        var docEditor = new global.Asc.Docs.Api(container);
        docEditor.Init(config);
        return docEditor;
    }

    // Initialize OnlyOffice Spreadsheet Editor (Excel)
    function initSpreadsheetEditor(container, config) {
        if (!global.Asc || !global.Asc.Spreadsheet || !global.Asc.Spreadsheet.Api) {
            throw new Error('OnlyOffice Cell SDK not loaded');
        }

        var docEditor = new global.Asc.Spreadsheet.Api(container);
        docEditor.Init(config);
        return docEditor;
    }

    // Initialize OnlyOffice Presentation Editor (PowerPoint)
    function initPresentationEditor(container, config) {
        if (!global.Asc || !global.Asc.Presentations || !global.Asc.Presentations.Api) {
            throw new Error('OnlyOffice Slide SDK not loaded');
        }

        var docEditor = new global.Asc.Presentations.Api(container);
        docEditor.Init(config);
        return docEditor;
    }

    // Initialize editor based on document type
    function initEditor(container, config, type) {
        switch (type) {
            case 'word':
                return initDocumentEditor(container, config);
            case 'cell':
                return initSpreadsheetEditor(container, config);
            case 'slide':
                return initPresentationEditor(container, config);
            default:
                return initDocumentEditor(container, config);
        }
    }

    // Export to global scope
    global.Asc = global.Asc || {};
    global.Asc.SDK = SDK;
    global.Asc.loadEditorSdk = loadEditorSdk;
    global.Asc.loadAllSdks = loadAllSdks;
    global.Asc.initDocumentEditor = initDocumentEditor;
    global.Asc.initSpreadsheetEditor = initSpreadsheetEditor;
    global.Asc.initPresentationEditor = initPresentationEditor;
    global.Asc.initEditor = initEditor;
    global.Asc.getFileType = getFileType;

    // Set base path for x2t wasm
    if (!global.Module) {
        global.Module = {};
    }
    global.Module.locateFile = function(path) {
        return '/office/wasm/x2t/' + path;
    };

})(typeof window !== 'undefined' ? window : this);
