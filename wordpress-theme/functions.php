<?php

function forgelinea_theme_setup(): void
{
    add_theme_support('title-tag');
}
add_action('after_setup_theme', 'forgelinea_theme_setup');

function forgelinea_theme_build_notice(string $message): void
{
    if (!current_user_can('manage_options')) {
        return;
    }

    add_action('admin_notices', static function () use ($message): void {
        printf(
            '<div class="notice notice-error"><p>%s</p></div>',
            esc_html($message)
        );
    });
}

function forgelinea_enqueue_assets(): void
{
    $manifest_path = get_theme_file_path('/build/manifest.json');
    if (!is_readable($manifest_path)) {
        forgelinea_theme_build_notice(
            'Forgelinea theme assets are missing. Run "npm run build:wordpress" and upload the generated wordpress-theme folder.'
        );
        return;
    }

    $manifest = json_decode((string) file_get_contents($manifest_path), true);
    $entry = is_array($manifest) ? ($manifest['src/main.tsx'] ?? null) : null;
    if (!is_array($entry) || !isset($entry['file']) || !is_string($entry['file'])) {
        forgelinea_theme_build_notice(
            'The Forgelinea theme asset manifest is invalid. Rebuild the theme with "npm run build:wordpress".'
        );
        return;
    }

    $script_path = get_theme_file_path('/build/' . $entry['file']);
    if (!is_file($script_path)) {
        forgelinea_theme_build_notice(
            'The Forgelinea theme JavaScript bundle is missing. Rebuild the theme with "npm run build:wordpress".'
        );
        return;
    }

    wp_enqueue_script(
        'forgelinea-app',
        get_theme_file_uri('/build/' . $entry['file']),
        [],
        (string) filemtime($script_path),
        true
    );

    foreach (($entry['css'] ?? []) as $index => $css_file) {
        if (!is_string($css_file)) {
            continue;
        }

        $style_path = get_theme_file_path('/build/' . $css_file);
        if (is_file($style_path)) {
            wp_enqueue_style(
                'forgelinea-app-' . $index,
                get_theme_file_uri('/build/' . $css_file),
                [],
                (string) filemtime($style_path)
            );
        }
    }
}
add_action('wp_enqueue_scripts', 'forgelinea_enqueue_assets');

function forgelinea_module_script_tag(string $tag, string $handle, string $src): string
{
    if ($handle !== 'forgelinea-app') {
        return $tag;
    }

    if (strpos($tag, 'type=') !== false) {
        return $tag;
    }

    return str_replace('<script ', '<script type="module" ', $tag);
}
add_filter('script_loader_tag', 'forgelinea_module_script_tag', 10, 3);
