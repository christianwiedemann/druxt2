<?php

namespace Drupal\druxt_oauth\Controller;

use Drupal\simple_oauth\Controller\Oauth2Token;
use Psr\Http\Message\ServerRequestInterface;
use Symfony\Component\HttpFoundation\Request;

/**
 * Controller class for the token endpoint.
 */
class Token extends Oauth2Token {

  /**
   * {@inheritdoc}
   */
  public function tokenOverride(ServerRequestInterface $request, Request $cool_request) {

    // Nuxt sends POST data via json, which we have to parse first.
    $data = $cool_request->getContent();
    parse_str($data, $vars);
    return parent::token($request->withParsedBody($vars));
  }

}
