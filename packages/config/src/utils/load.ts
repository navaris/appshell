import fs from 'fs';
import yaml from 'yaml';

/**
 * Reads the YAML file
 * @param configPath to configuration file
 * @returns a yaml object
 */
const load = <TSchema>(configPath: string): TSchema => {
  if (!fs.existsSync(configPath)) {
    throw new Error(
      `Config file does not exist, using default config. __dirname: ${__dirname} Path: ${configPath}`,
    );
  }

  const configYAML = fs.readFileSync(configPath).toString();

  return yaml.parse(configYAML);
};

/**
 * Loads the YAML files specified by paths
 * @param paths Paths to configurations to process
 * @returns yaml objects
 */
export const loadAll = <TSchema>(...paths: string[]): TSchema[] => paths.map((path) => load(path));

export default load;
