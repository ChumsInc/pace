<?php
/**
 * @package Chums Inc
 * @subpackage Imprint Status
 * @author Steve Montgomery
 * @copyright Copyright &copy; 2011, steve
 */

require_once ("autoload.inc.php");
require_once ("access.inc.php");

$bodyPath = "apps/pace";
$title = "Pace Report";

$ui = new WebUI($bodyPath, $title, '', true, 5);

//$ui->AddCSS("public/bin-location.css?v={$ui->version}");
$ui->addManifest('public/js/manifest.json');
$ui->Send();
