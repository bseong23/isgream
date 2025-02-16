pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
        ENV_FILE_PATH = '/home/ubuntu/.env' 
    }

    stages {

        stage('Check Environment') {
            steps {
                sh 'whoami'           
                sh 'git --version'     
                sh 'echo $PATH'       
                sh 'printenv | grep SPRING_' 
            }
        }
        
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Set Permissions') {
            steps {
                dir('Backend/IsCream') {
                    sh 'chmod +x ./gradlew'
                }
                dir('Frontend/IsCream') {
                    sh 'chmod +x ./node_modules/.bin/* || true'
                }
            }
        }

        stage('Load Environment Variables') {
            steps {
                script {
                    sh "export \$(grep -v '^#' ${ENV_FILE_PATH} | xargs)"
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('Backend/IsCream') {
                    sh './gradlew clean build'
                }
            }
        }

        stage('Build AI Server') {
            steps {
                dir('AI') {
                    sh 'docker build -t ai-server .'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('Frontend/IsCream') {
                    sh 'rm -rf node_modules package-lock.json'
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Stop Existing Containers') {
            steps {
                script {
                    sh '''
                        docker ps -q --filter "name=nginx" | xargs -r docker stop
                        docker ps -aq --filter "name=nginx" | xargs -r docker rm
                        
                        docker ps -q --filter "name=backend" | xargs -r docker stop
                        docker ps -aq --filter "name=backend" | xargs -r docker rm
                        
                        docker ps -q --filter "name=ai-server" | xargs -r docker stop
                        docker ps -aq --filter "name=ai-server" | xargs -r docker rm
                    '''
                }
            }
        }

        stage('Docker Compose Up') {
            steps {
                script {
                    sh '''
                        docker-compose down
                        docker-compose up -d --build
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment 성공!'
        }
        failure {
            echo 'Deployment 실패!'
        }
    }
}
